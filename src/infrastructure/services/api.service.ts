/**
 * @fileoverview Centralized API service with Axios configuration, interceptors, and error handling
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { appConfig } from '../config/app.config';
import { logger , measurePerformance } from '../utils/logger';
import { jwtUtil } from '../utils/jwt';
import { 
  STORAGE_KEYS, 
  ERROR_CODES, 
  HTTP_STATUS, 
  API_CONSTANTS,
} from '../../shared/constants';
import type { ApiResponse, ApiError, PaginatedApiResponse } from '../../shared/types';

/**
 * API request configuration with additional options
 */
interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean;
  skipLogging?: boolean;
  retries?: number;
}

/**
 * Retry configuration
 */
interface RetryConfig {
  retries: number;
  delay: number;
  retryCondition: (error: AxiosError) => boolean;
}

/**
 * API service class for handling HTTP requests
 */
class ApiService {
  private readonly client: AxiosInstance;
  private readonly baseURL: string;
  private readonly timeout: number;
  private isRefreshingToken = false;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.baseURL = appConfig.apiUrl;
    this.timeout = appConfig.apiTimeout;
    
    this.client = this.createAxiosInstance();
    this.setupInterceptors();
    
    logger.info('API service initialized', { 
      baseURL: this.baseURL,
      timeout: this.timeout,
    }, 'API');
  }

  /**
   * Creates and configures Axios instance
   * @returns Configured Axios instance
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Sets up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );

    logger.debug('API interceptors configured', undefined, 'API');
  }

  /**
   * Handles outgoing requests
   * @param config Request configuration
   * @returns Modified request configuration
   */
  private async handleRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const requestConfig = config as any as ApiRequestConfig;
    
    // Add authentication token
    const token = await this.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    const requestId = this.generateRequestId();
    config.headers['X-Request-ID'] = requestId;

    // Log request if not disabled
    if (!requestConfig.skipLogging) {
      logger.apiRequest(
        config.method?.toUpperCase() || 'GET',
        `${config.baseURL}${config.url}`,
        config.data,
        'API'
      );
    }

    return config;
  }

  /**
   * Handles request errors
   * @param error Request error
   * @returns Rejected promise with error
   */
  private handleRequestError(error: AxiosError): Promise<AxiosError> {
    logger.error('API request error', error, 'API');
    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Handles successful responses
   * @param response Axios response
   * @returns Response data
   */
  private handleResponse(response: AxiosResponse): AxiosResponse {
    const config = response.config as any as ApiRequestConfig;
    
    if (!config.skipLogging) {
      logger.apiResponse(
        response.config.method?.toUpperCase() || 'GET',
        `${response.config.baseURL}${response.config.url}`,
        response.status,
        response.data,
        'API'
      );
    }

    return response;
  }

  /**
   * Handles response errors
   * @param error Response error
   * @returns Rejected promise with normalized error
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const config = error.config as any as ApiRequestConfig;
    
    // Handle token refresh for 401 errors
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !config?.skipAuthRefresh) {
      return this.handleUnauthorizedError(error);
    }

    // Handle retry logic
    if (this.shouldRetry(error, config)) {
      return this.retryRequest(error);
    }

    const normalizedError = this.normalizeError(error);
    
    logger.apiResponse(
      error.config?.method?.toUpperCase() || 'GET',
      `${error.config?.baseURL}${error.config?.url}`,
      error.response?.status || 0,
      normalizedError,
      'API'
    );

    return Promise.reject(normalizedError);
  }

  /**
   * Handles unauthorized errors with token refresh
   * @param error Original error
   * @returns Retry request or reject
   */
  private async handleUnauthorizedError(error: AxiosError): Promise<any> {
    if (this.isRefreshingToken) {
      // Wait for ongoing refresh to complete
      try {
        const newToken = await this.refreshTokenPromise;
        if (newToken && error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return this.client(error.config);
        }
      } catch (refreshError) {
        logger.error('Token refresh wait failed', refreshError, 'API');
      }
    } else {
      // Start token refresh
      try {
        const newToken = await this.refreshAccessToken();
        if (newToken && error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return this.client(error.config);
        }
      } catch (refreshError) {
        logger.error('Token refresh failed', refreshError, 'API');
        await this.handleAuthenticationFailure();
      }
    }

    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Refreshes the access token
   * @returns New access token
   */
  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshingToken && this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.isRefreshingToken = true;
    this.refreshTokenPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshTokenPromise;
      return newToken;
    } finally {
      this.isRefreshingToken = false;
      this.refreshTokenPromise = null;
    }
  }

  /**
   * Performs the actual token refresh
   * @returns New access token
   */
  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post('/auth/refresh', 
        { refreshToken },
        { skipAuthRefresh: true, skipLogging: false } as ApiRequestConfig
      );

      const { accessToken } = response.data;
      
      if (accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        logger.info('Access token refreshed successfully', undefined, 'API');
        return accessToken;
      }

      throw new Error('No access token in refresh response');
    } catch (error) {
      logger.error('Token refresh failed', error, 'API');
      throw error;
    }
  }

  /**
   * Handles authentication failure
   */
  private async handleAuthenticationFailure(): Promise<void> {
    logger.warn('Authentication failure, clearing tokens', undefined, 'API');
    
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  }

  /**
   * Determines if a request should be retried
   * @param error Request error
   * @param config Request configuration
   * @returns True if should retry
   */
  private shouldRetry(error: AxiosError, config?: ApiRequestConfig): boolean {
    if (!config || (config.retries !== undefined && config.retries <= 0)) {
      return false;
    }

    // Don't retry on 4xx errors (except 408, 429)
    const status = error.response?.status;
    if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
      return false;
    }

    return true;
  }

  /**
   * Retries a failed request
   * @param error Original error
   * @returns Retry request
   */
  private async retryRequest(error: AxiosError): Promise<any> {
    const config = error.config as any as ApiRequestConfig;
    const retries = (config.retries ?? API_CONSTANTS.RETRY_ATTEMPTS) - 1;
    
    logger.warn('Retrying failed request', { 
      retriesLeft: retries,
      url: config.url,
      status: error.response?.status,
    }, 'API');

    // Add delay before retry
    await this.delay(API_CONSTANTS.RETRY_DELAY);

    return this.client({
      ...config,
      retries,
    });
  }

  /**
   * Normalizes errors to consistent format
   * @param error Axios error
   * @returns Normalized error object
   */
  private normalizeError(error: AxiosError): ApiError {
    const response = error.response;
    
    if (response) {
      return {
        message: response.data?.message || error.message || 'API request failed',
        code: response.data?.code || this.getErrorCode(response.status),
        details: response.data,
        timestamp: new Date().toISOString(),
      };
    }

    // Network or timeout error
    return {
      message: error.message || 'Network error',
      code: error.code === 'ECONNABORTED' ? ERROR_CODES.TIMEOUT_ERROR : ERROR_CODES.NETWORK_ERROR,
      details: { originalError: error.toJSON() },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Maps HTTP status to error code
   * @param status HTTP status code
   * @returns Error code
   */
  private getErrorCode(status: number): string {
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_CODES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_CODES.UNAUTHORIZED;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_CODES.NOT_FOUND || 'NOT_FOUND';
      case HTTP_STATUS.CONFLICT:
        return ERROR_CODES.VALIDATION_ERROR;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return ERROR_CODES.VALIDATION_ERROR;
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return ERROR_CODES.RATE_LIMIT_EXCEEDED;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_CODES.INTERNAL_SERVER_ERROR;
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_CODES.SERVICE_UNAVAILABLE;
      default:
        return 'UNKNOWN_ERROR';
    }
  }

  /**
   * Gets stored access token
   * @returns Access token or null
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      logger.error('Failed to get access token', error, 'API');
      return null;
    }
  }

  /**
   * Generates unique request ID
   * @returns Request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Adds delay for retry logic
   * @param ms Delay in milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods

  /**
   * GET request
   * @param url Request URL
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async get<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST request
   * @param url Request URL
   * @param data Request data
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async post<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   * @param url Request URL
   * @param data Request data
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async put<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   * @param url Request URL
   * @param data Request data
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   * @param url Request URL
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async delete<T = any>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * GET request for paginated data
   * @param url Request URL
   * @param config Request configuration
   * @returns Paginated API response
   */
  @measurePerformance
  public async getPaginated<T = any>(
    url: string, 
    config?: ApiRequestConfig
  ): Promise<PaginatedApiResponse<T>> {
    const response = await this.client.get<PaginatedApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Upload file request
   * @param url Request URL
   * @param file File data
   * @param config Request configuration
   * @returns API response
   */
  @measurePerformance
  public async upload<T = any>(
    url: string,
    file: FormData,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const uploadConfig: ApiRequestConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await this.client.post<ApiResponse<T>>(url, file, uploadConfig);
    return response.data;
  }

  /**
   * Sets authentication token
   * @param token JWT token
   */
  public setAuthToken(token: string): void {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
    logger.debug('Auth token set for API client', undefined, 'API');
  }

  /**
   * Clears authentication token
   */
  public clearAuthToken(): void {
    delete this.client.defaults.headers.common.Authorization;
    logger.debug('Auth token cleared from API client', undefined, 'API');
  }
}

/**
 * Singleton API service instance
 */
export const apiService = new ApiService();
