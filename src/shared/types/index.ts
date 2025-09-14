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
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Bank account entity
 */
export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'savings' | 'checking';
  balance: number;
  currency: 'USD' | 'EUR' | 'COP' | 'DOP';
  isActive: boolean;
  createdAt: Date;
  lastTransactionDate: Date;
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
  type: 'debit' | 'credit' | 'transfer';
  amount: number;
  description: string;
  category: TransactionCategory;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  toAccountId?: string; // For transfers
}

/**
 * Transaction category type
 */
export type TransactionCategory = 
  | 'transfer' | 'payment' | 'deposit' 
  | 'withdrawal' | 'fee' | 'interest';

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
