/**
 * @fileoverview Shared TypeScript type definitions
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

/**
 * Base API response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  status: number;
  timestamp?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Pagination metadata
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
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Authentication token structure
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * User authentication state
 */
export interface AuthState {
  user: User | null;
  tokens: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Base user entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bank account entity
 */
export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: BankAccountType;
  bankName: string;
  balance: number;
  currency: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bank account types enumeration
 */
export enum BankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT = 'credit',
  INVESTMENT = 'investment',
}

/**
 * Transaction entity
 */
export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category?: string;
  date: string;
  status: TransactionStatus;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction types enumeration
 */
export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  TRANSFER = 'transfer',
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Application theme modes
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Form validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Form state interface
 */
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Environment configuration type
 */
export interface AppConfig {
  apiUrl: string;
  apiTimeout: number;
  jwtSecretKey: string;
  tokenExpiration: number;
  encryptionKey: string;
  appSecret: string;
  environment: 'development' | 'staging' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  inactivityTimeout: number;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
}

/**
 * Navigation route parameters type
 */
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  AccountDetails: { accountId: string };
  TransactionDetails: { transactionId: string };
};
