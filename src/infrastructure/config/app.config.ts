/**
 * @fileoverview Application configuration management
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import Constants from 'expo-constants';

import { AppConfig } from '../../shared/types';

/**
 * Retrieves environment variable with type safety
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default value
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  
  return value || defaultValue || '';
};

/**
 * Converts string to number with validation
 * @param value String value to convert
 * @param defaultValue Default numeric value
 * @returns Converted number or default value
 */
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  
  if (Number.isNaN(parsed)) {
    console.warn(`Environment variable ${key} is not a valid number, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  return parsed;
};

/**
 * Converts string to boolean with validation
 * @param key Environment variable key
 * @param defaultValue Default boolean value
 * @returns Converted boolean or default value
 */
const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getEnvVar(key);
  
  if (!value) {
    return defaultValue;
  }
  
  return value.toLowerCase() === 'true';
};

/**
 * Application configuration object
 */
export const appConfig: AppConfig = {
  // API Configuration
  apiUrl: getEnvVar('EXPO_PUBLIC_API_URL', 'https://api.example.com'),
  apiTimeout: getEnvNumber('EXPO_PUBLIC_API_TIMEOUT', 10000),
  
  // Authentication
  jwtSecretKey: getEnvVar('EXPO_PUBLIC_JWT_SECRET_KEY', 'default-secret-key'),
  tokenExpiration: getEnvNumber('EXPO_PUBLIC_TOKEN_EXPIRATION', 3600),
  
  // Security
  encryptionKey: getEnvVar('EXPO_PUBLIC_ENCRYPTION_KEY', 'default-encryption-key'),
  appSecret: getEnvVar('EXPO_PUBLIC_APP_SECRET', 'default-app-secret'),
  
  // App Configuration
  environment: getEnvVar('EXPO_PUBLIC_APP_ENV', 'development') as 'development' | 'staging' | 'production',
  logLevel: getEnvVar('EXPO_PUBLIC_LOG_LEVEL', 'debug') as 'debug' | 'info' | 'warn' | 'error',
  inactivityTimeout: getEnvNumber('EXPO_PUBLIC_INACTIVITY_TIMEOUT', 900000),
  
  // Features
  enableAnalytics: getEnvBoolean('EXPO_PUBLIC_ENABLE_ANALYTICS', false),
  enableCrashReporting: getEnvBoolean('EXPO_PUBLIC_ENABLE_CRASH_REPORTING', false),
};

/**
 * Validates configuration on app startup
 */
export const validateConfig = (): void => {
  const requiredKeys: (keyof AppConfig)[] = [
    'apiUrl',
    'jwtSecretKey',
    'encryptionKey',
    'appSecret',
  ];
  
  const missingKeys = requiredKeys.filter((key) => !appConfig[key]);
  
  if (missingKeys.length > 0) {
    console.error('Missing required configuration keys:', JSON.stringify(missingKeys, null, 2));
    
    if (appConfig.environment === 'production') {
      throw new Error(`Missing required configuration: ${missingKeys.join(', ')}`);
    }
  }
  
  console.info('App configuration loaded:', JSON.stringify({
    ...appConfig,
    jwtSecretKey: '[HIDDEN]',
    encryptionKey: '[HIDDEN]',
    appSecret: '[HIDDEN]',
  }, null, 2));
};

/**
 * Checks if app is in development mode
 * @returns True if in development mode
 */
export const isDevelopment = (): boolean => appConfig.environment === 'development';

/**
 * Checks if app is in production mode
 * @returns True if in production mode
 */
export const isProduction = (): boolean => appConfig.environment === 'production';

/**
 * Gets the current environment
 * @returns Current environment string
 */
export const getEnvironment = (): string => appConfig.environment;
