/**
 * @fileoverview Application constants and configuration values
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

/**
 * API related constants
 */
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  PAGINATION_LIMIT: 20,
} as const;

/**
 * Authentication constants
 */
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRATION_BUFFER: 60000, // 1 minute buffer
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes
} as const;

/**
 * Security constants
 */
export const SECURITY_CONSTANTS = {
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  HASH_ALGORITHM: 'SHA-256',
  SALT_ROUNDS: 12,
  IV_LENGTH: 16,
  TAG_LENGTH: 16,
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  BIOMETRIC_ENABLED: '@biometric_enabled',
  THEME_MODE: '@theme_mode',
  LANGUAGE: '@language',
  LAST_ACTIVITY: '@last_activity',
  APP_STATE: '@app_state',
} as const;

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  ACCOUNT_NUMBER: /^\d{10,18}$/,
  CREDIT_CARD: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 64,
  TAB_BAR_HEIGHT: 80,
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    EXTRA_LARGE: 16,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  ANIMATION: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: 'ease-in-out',
  },
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Business logic errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
} as const;

/**
 * Log levels
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

/**
 * App states
 */
export const APP_STATES = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive',
} as const;

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  BIOMETRIC_AUTH: 'biometric_auth',
  DARK_MODE: 'dark_mode',
  ANALYTICS: 'analytics',
  CRASH_REPORTING: 'crash_reporting',
  PUSH_NOTIFICATIONS: 'push_notifications',
} as const;

/**
 * Default values
 */
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 20,
  },
  CURRENCY: 'USD',
  LANGUAGE: 'en',
  THEME: 'system',
  INACTIVITY_TIMEOUT: 900000, // 15 minutes
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
