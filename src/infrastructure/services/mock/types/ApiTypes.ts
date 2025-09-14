/**
 * @fileoverview API response types for banking app mock services
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import type { AuthToken, BankAccount, Transaction, User } from '../../../../shared/types';

/**
 * Base API response interface
 */
export interface BaseApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Successful API response
 */
export interface SuccessApiResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
}

/**
 * Error API response
 */
export interface ErrorApiResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    details?: any;
  };
  data?: never;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = SuccessApiResponse<T> | ErrorApiResponse;

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T = any> extends SuccessApiResponse<T[]> {
  pagination: PaginationMeta;
}

// === Authentication Types ===

/**
 * Login request data
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  user: User;
  tokens: AuthToken;
  sessionId: string;
}

/**
 * Register request data
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Register response data
 */
export interface RegisterResponse {
  user: User;
  tokens: AuthToken;
  sessionId: string;
}

/**
 * Refresh token request data
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response data
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// === Account Types ===

/**
 * Account list response data
 */
export interface AccountListResponse {
  accounts: BankAccount[];
  totalBalance: number;
  currency: string;
}

/**
 * Account detail response data
 */
export interface AccountDetailResponse {
  account: BankAccount;
  recentTransactions: Transaction[];
  monthlyStats: {
    totalDebits: number;
    totalCredits: number;
    transactionCount: number;
  };
}

/**
 * Balance inquiry response data
 */
export interface BalanceInquiryResponse {
  accountId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

// === Transaction Types ===

/**
 * Transaction filter request
 */
export interface TransactionFilterRequest {
  accountId?: string;
  type?: 'debit' | 'credit' | 'transfer';
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
  page?: number;
  limit?: number;
}

/**
 * Transaction history response data
 */
export interface TransactionHistoryResponse {
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    netAmount: number;
  };
}

// === Transfer Types ===

/**
 * Transfer request data
 */
export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  transferType: 'internal' | 'external';
}

/**
 * Transfer validation request
 */
export interface TransferValidationRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

/**
 * Transfer validation response
 */
export interface TransferValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  estimatedFee: number;
  fromAccount: {
    id: string;
    balance: number;
    accountNumber: string;
  };
  toAccount: {
    id: string;
    accountNumber: string;
  };
}

/**
 * Transfer response data
 */
export interface TransferResponse {
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  fee: number;
  fromAccount: {
    id: string;
    newBalance: number;
  };
  toAccount: {
    id: string;
    newBalance: number;
  };
  reference: string;
  completedAt: string;
}

// === User Profile Types ===

/**
 * User profile response data
 */
export interface UserProfileResponse {
  user: User;
  preferences: {
    language: string;
    notifications: boolean;
    biometrics: boolean;
    theme: string;
  };
  statistics: {
    accountCount: number;
    totalBalance: number;
    lastLoginDate: string;
    memberSince: string;
  };
}

/**
 * Update profile request data
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
    biometrics?: boolean;
    theme?: string;
  };
}

// === Mock Service Types ===

/**
 * Mock delay configuration
 */
export interface MockDelayConfig {
  min: number;
  max: number;
}

/**
 * Mock error configuration
 */
export interface MockErrorConfig {
  shouldFail: boolean;
  errorType: 'network' | 'server' | 'validation' | 'unauthorized';
  errorCode: string;
  errorMessage: string;
}

/**
 * Mock service configuration
 */
export interface MockServiceConfig {
  enableLogs: boolean;
  delay: MockDelayConfig;
  errorSimulation?: MockErrorConfig;
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
}

/**
 * Mock response helper type
 */
export type MockResponse<T> = Promise<ApiResponse<T>>;

/**
 * Mock paginated response helper type
 */
export type MockPaginatedResponse<T> = Promise<PaginatedApiResponse<T>>;

// === Utility Types ===

/**
 * Creates a success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Operation successful',
  requestId?: string
): SuccessApiResponse<T> => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
  requestId,
});

/**
 * Creates an error response
 */
export const createErrorResponse = (
  code: string,
  message: string,
  details?: any,
  requestId?: string
): ErrorApiResponse => ({
  success: false,
  message,
  error: {
    code,
    details,
  },
  timestamp: new Date().toISOString(),
  requestId,
});

/**
 * Creates a paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully',
  requestId?: string
): PaginatedApiResponse<T> => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    requestId,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};
