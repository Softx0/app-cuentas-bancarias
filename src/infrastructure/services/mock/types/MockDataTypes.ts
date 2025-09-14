/**
 * @fileoverview Mock data interfaces and types for banking app simulation
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

/**
 * Mock service response delay configuration
 */
export interface MockDelayConfig {
  enabled: boolean;
  min: number;
  max: number;
}

/**
 * Mock error simulation configuration
 */
export interface MockErrorSimulation {
  enabled: boolean;
  probability: number; // 0-1, probability of error occurring
  errors: MockErrorConfig[];
}

/**
 * Individual mock error configuration
 */
export interface MockErrorConfig {
  type: 'network' | 'server' | 'validation' | 'unauthorized' | 'forbidden' | 'not_found';
  httpStatus: number;
  code: string;
  message: string;
  weight: number; // Relative probability of this error type
}

/**
 * Mock API endpoint configuration
 */
export interface MockEndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  delay: MockDelayConfig;
  errorSimulation: MockErrorSimulation;
  requiresAuth: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Global mock service configuration
 */
export interface MockServiceConfig {
  environment: 'development' | 'staging' | 'production';
  enableLogs: boolean;
  enableMetrics: boolean;
  globalDelay: MockDelayConfig;
  globalErrorSimulation: MockErrorSimulation;
  endpoints: Record<string, MockEndpointConfig>;
  database: {
    autoSave: boolean;
    resetOnRestart: boolean;
  };
}

/**
 * Mock database state
 */
export interface MockDatabaseState {
  users: any[][];
  accounts: any[][];
  transactions: any[][];
  sessions: Map<string, any>;
  lastModified: Date;
}

/**
 * Mock API metrics
 */
export interface MockApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  endpointStats: Record<string, {
    requests: number;
    successes: number;
    failures: number;
    avgResponseTime: number;
  }>;
  errorStats: Record<string, number>;
  lastReset: Date;
}

/**
 * Mock session data
 */
export interface MockSession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
  isActive: boolean;
  metadata: {
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * Mock rate limiting data
 */
export interface MockRateLimit {
  key: string;
  requests: number;
  windowStart: Date;
  blocked: boolean;
}

/**
 * Mock audit log entry
 */
export interface MockAuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  endpoint: string;
  method: string;
  requestData?: any;
  responseStatus: number;
  responseTime: number;
  ipAddress?: string;
  userAgent?: string;
  error?: string;
}

/**
 * Mock notification event
 */
export interface MockNotificationEvent {
  id: string;
  type: 'transaction' | 'transfer' | 'login' | 'security' | 'system';
  userId: string;
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  delivered: boolean;
}

/**
 * Mock feature flag
 */
export interface MockFeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  rolloutPercentage: number;
  enabledForUsers: string[];
  metadata?: Record<string, any>;
}

/**
 * Default mock service configuration
 */
export const DEFAULT_MOCK_CONFIG: MockServiceConfig = {
  environment: 'development',
  enableLogs: true,
  enableMetrics: true,
  globalDelay: {
    enabled: true,
    min: 500,
    max: 1500,
  },
  globalErrorSimulation: {
    enabled: false,
    probability: 0.05, // 5% chance of error
    errors: [
      {
        type: 'network',
        httpStatus: 0,
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        weight: 3,
      },
      {
        type: 'server',
        httpStatus: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error occurred',
        weight: 2,
      },
      {
        type: 'validation',
        httpStatus: 400,
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        weight: 1,
      },
    ],
  },
  endpoints: {},
  database: {
    autoSave: false,
    resetOnRestart: true,
  },
};

/**
 * Common mock error responses
 */
export const MOCK_ERRORS = {
  UNAUTHORIZED: {
    type: 'unauthorized' as const,
    httpStatus: 401,
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    weight: 1,
  },
  FORBIDDEN: {
    type: 'forbidden' as const,
    httpStatus: 403,
    code: 'FORBIDDEN',
    message: 'Access denied',
    weight: 1,
  },
  NOT_FOUND: {
    type: 'not_found' as const,
    httpStatus: 404,
    code: 'NOT_FOUND',
    message: 'Resource not found',
    weight: 1,
  },
  VALIDATION_ERROR: {
    type: 'validation' as const,
    httpStatus: 400,
    code: 'VALIDATION_ERROR',
    message: 'Request validation failed',
    weight: 1,
  },
  SERVER_ERROR: {
    type: 'server' as const,
    httpStatus: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    weight: 2,
  },
  NETWORK_ERROR: {
    type: 'network' as const,
    httpStatus: 0,
    code: 'NETWORK_ERROR',
    message: 'Network connection failed',
    weight: 3,
  },
} as const;
