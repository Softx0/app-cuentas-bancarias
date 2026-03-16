/**
 * @fileoverview Mock Authentication Service for banking app
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import type { User } from '../../../shared/types';
import { jwtUtil } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import {
  createUser,
  emailExists,
  findUserByEmail,
  updateLastLogin,
  usernameExists,
  validateCredentials
} from './data/mockUsers';
import type {
  LoginRequest,
  LoginResponse,
  MockResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse
} from './types/ApiTypes';

import {
  createErrorResponse,
  createSuccessResponse
} from './types/ApiTypes';

/**
 * Mock Authentication Service
 * Simulates real authentication API with realistic delays and responses
 */
class MockAuthService {
  private readonly serviceName = 'MockAuthService';

  /**
   * Simulates API delay for realistic behavior
   * @param min Minimum delay in ms
   * @param max Maximum delay in ms
   */
  private async simulateDelay(min: number = 500, max: number = 1500): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Validates login request data
   * @param data Login request data
   * @returns Validation errors or null if valid
   */
  private validateLoginRequest(data: LoginRequest): string[] {
    const errors: string[] = [];

    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.password || data.password.trim() === '') {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  }

  /**
   * Validates register request data
   * @param data Register request data
   * @returns Validation errors or null if valid
   */
  private validateRegisterRequest(data: RegisterRequest): string[] {
    const errors: string[] = [];

    // First name validation
    if (!data.firstName || data.firstName.trim() === '') {
      errors.push('First name is required');
    } else if (data.firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    // Last name validation
    if (!data.lastName || data.lastName.trim() === '') {
      errors.push('Last name is required');
    } else if (data.lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Username validation
    if (!data.username || data.username.trim() === '') {
      errors.push('Username is required');
    } else if (data.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (!/^[a-zA-Z0-9._-]+$/.test(data.username)) {
      errors.push('Username can only contain letters, numbers, dots, underscores, and hyphens');
    }

    // Email validation
    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!data.password || data.password.trim() === '') {
      errors.push('Password is required');
    } else if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.push('Password confirmation is required');
    } else if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  /**
   * Checks for existing user data conflicts
   * @param data Register request data
   * @returns Conflict errors or empty array
   */
  private checkUserConflicts(data: RegisterRequest): string[] {
    const errors: string[] = [];

    if (emailExists(data.email)) {
      errors.push('An account with this email already exists');
    }

    if (usernameExists(data.username)) {
      errors.push('This username is already taken');
    }

    return errors;
  }

  /**
   * User login authentication
   * @param data Login request data
   * @returns Login response
   */
  public async login(data: LoginRequest): MockResponse<LoginResponse> {
    try {
      logger.info('Mock login attempt', { email: data.email }, this.serviceName);
      
      // Simulate network delay
      await this.simulateDelay();

      // Validate request
      const validationErrors = this.validateLoginRequest(data);
      if (validationErrors.length > 0) {
        logger.warn('Login validation failed', { errors: validationErrors }, this.serviceName);
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Login validation failed',
          { fieldErrors: validationErrors }
        );
      }

      // Check credentials
      if (!validateCredentials(data.email, data.password)) {
        logger.warn('Invalid credentials', { email: data.email }, this.serviceName);
        return createErrorResponse(
          'INVALID_CREDENTIALS',
          'Invalid email or password'
        );
      }

      // Find user
      const user = findUserByEmail(data.email);
      if (!user) {
        logger.error('User not found after credential validation', { email: data.email }, this.serviceName);
        return createErrorResponse(
          'USER_NOT_FOUND',
          'User account not found'
        );
      }

      if (!user.isActive) {
        logger.warn('Inactive user login attempt', { userId: user.id }, this.serviceName);
        return createErrorResponse(
          'ACCOUNT_INACTIVE',
          'User account is inactive'
        );
      }

      // Generate tokens
      const tokens = await jwtUtil.generateTokenPair(user);
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update last login
      updateLastLogin(user.id);

      const responseData: LoginResponse = {
        user,
        tokens,
        sessionId,
      };

      logger.info('Login successful', { 
        userId: user.id, 
        email: user.email,
        sessionId,
      }, this.serviceName);

      return createSuccessResponse(responseData, 'Login successful');

    } catch (error) {
      logger.error('Login error', error, this.serviceName);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'An internal error occurred during login'
      );
    }
  }

  /**
   * User registration
   * @param data Register request data
   * @returns Register response
   */
  public async register(data: RegisterRequest): MockResponse<RegisterResponse> {
    try {
      logger.info('Mock registration attempt', { 
        email: data.email, 
        username: data.username,
      }, this.serviceName);

      // Simulate network delay
      await this.simulateDelay(800, 2000); // Registration takes longer

      // Validate request
      const validationErrors = this.validateRegisterRequest(data);
      if (validationErrors.length > 0) {
        logger.warn('Registration validation failed', { errors: validationErrors }, this.serviceName);
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Registration validation failed',
          { fieldErrors: validationErrors }
        );
      }

      // Check for conflicts
      const conflictErrors = this.checkUserConflicts(data);
      if (conflictErrors.length > 0) {
        logger.warn('Registration conflicts found', { errors: conflictErrors }, this.serviceName);
        return createErrorResponse(
          'CONFLICT_ERROR',
          'User data conflicts found',
          { fieldErrors: conflictErrors }
        );
      }

      // Create user
      const newUser = createUser(data);

      // Generate tokens
      const tokens = await jwtUtil.generateTokenPair(newUser);
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const responseData: RegisterResponse = {
        user: newUser,
        tokens,
        sessionId,
      };

      logger.info('Registration successful', { 
        userId: newUser.id, 
        email: newUser.email,
        sessionId,
      }, this.serviceName);

      return createSuccessResponse(responseData, 'Account created successfully');

    } catch (error) {
      logger.error('Registration error', error, this.serviceName);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'An internal error occurred during registration'
      );
    }
  }

  /**
   * Refresh access token
   * @param data Refresh token request data
   * @returns New access token
   */
  public async refreshToken(data: RefreshTokenRequest): MockResponse<RefreshTokenResponse> {
    try {
      logger.info('Mock token refresh attempt', undefined, this.serviceName);

      // Simulate network delay
      await this.simulateDelay(300, 800);

      // Validate refresh token
      if (!data.refreshToken) {
        logger.warn('Refresh token missing', undefined, this.serviceName);
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Refresh token is required'
        );
      }

      // Verify refresh token
      const verification = await jwtUtil.verifyToken(data.refreshToken);
      if (!verification.isValid || !verification.payload) {
        logger.warn('Invalid refresh token', { error: verification.error }, this.serviceName);
        return createErrorResponse(
          'INVALID_TOKEN',
          'Invalid or expired refresh token'
        );
      }

      // Check if it's actually a refresh token
      if (verification.payload.type !== 'refresh') {
        logger.warn('Wrong token type for refresh', { type: verification.payload.type }, this.serviceName);
        return createErrorResponse(
          'INVALID_TOKEN',
          'Token is not a refresh token'
        );
      }

      // Find user
      const user = findUserByEmail(verification.payload.email);
      if (!user || !user.isActive) {
        logger.warn('User not found or inactive during token refresh', { 
          userId: verification.payload.userId,
        }, this.serviceName);
        return createErrorResponse(
          'USER_NOT_FOUND',
          'User account not found or inactive'
        );
      }

      // Generate new access token
      const newAccessToken = await jwtUtil.generateAccessToken(user);

      const responseData: RefreshTokenResponse = {
        accessToken: newAccessToken,
        expiresIn: 3600, // 1 hour
      };

      logger.info('Token refresh successful', { userId: user.id }, this.serviceName);

      return createSuccessResponse(responseData, 'Token refreshed successfully');

    } catch (error) {
      logger.error('Token refresh error', error, this.serviceName);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'An internal error occurred during token refresh'
      );
    }
  }

  /**
   * Logout user (invalidate session)
   * @param accessToken Current access token
   * @returns Logout confirmation
   */
  public async logout(accessToken: string): MockResponse<{ success: boolean }> {
    try {
      logger.info('Mock logout attempt', undefined, this.serviceName);

      // Simulate network delay
      await this.simulateDelay(200, 500);

      // Verify token (just for logging, not strictly necessary for logout)
      const verification = await jwtUtil.verifyToken(accessToken);
      if (verification.isValid && verification.payload) {
        logger.info('Logout successful', { userId: verification.payload.userId }, this.serviceName);
      } else {
        logger.info('Logout successful (invalid token)', undefined, this.serviceName);
      }

      // In a real implementation, we would invalidate the token in the database
      // For mock purposes, we just return success

      return createSuccessResponse({ success: true }, 'Logout successful');

    } catch (error) {
      logger.error('Logout error', error, this.serviceName);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'An internal error occurred during logout'
      );
    }
  }

  /**
   * Validate current session/token
   * @param accessToken Access token to validate
   * @returns Session validation result
   */
  public async validateSession(accessToken: string): MockResponse<{ user: User; valid: boolean }> {
    try {
      logger.debug('Mock session validation', undefined, this.serviceName);

      // Simulate network delay
      await this.simulateDelay(200, 400);

      if (!accessToken) {
        return createErrorResponse(
          'VALIDATION_ERROR',
          'Access token is required'
        );
      }

      // Verify token
      const verification = await jwtUtil.verifyToken(accessToken);
      if (!verification.isValid || !verification.payload) {
        logger.warn('Invalid session token', { error: verification.error }, this.serviceName);
        return createErrorResponse(
          'INVALID_TOKEN',
          'Invalid or expired access token'
        );
      }

      // Find user
      const user = findUserByEmail(verification.payload.email);
      if (!user || !user.isActive) {
        logger.warn('User not found or inactive during session validation', { 
          userId: verification.payload.userId,
        }, this.serviceName);
        return createErrorResponse(
          'USER_NOT_FOUND',
          'User account not found or inactive'
        );
      }

      logger.debug('Session validation successful', { userId: user.id }, this.serviceName);

      return createSuccessResponse(
        { user, valid: true },
        'Session is valid'
      );

    } catch (error) {
      logger.error('Session validation error', error, this.serviceName);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'An internal error occurred during session validation'
      );
    }
  }
}

/**
 * Singleton instance of Mock Authentication Service
 */
export const mockAuthService = new MockAuthService();

console.log(' Mock Authentication Service initialized');
