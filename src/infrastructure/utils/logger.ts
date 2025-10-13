/**
 * @fileoverview Centralized logging utility with different log levels
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { LOG_LEVELS } from '../../shared/constants';
import { appConfig } from '../config/app.config';

/**
 * Log level type definition
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry interface
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

/**
 * Logger class for centralized logging
 */
class Logger {
  private readonly logLevel: LogLevel;
  private readonly isProduction: boolean;

  constructor() {
    this.logLevel = appConfig.logLevel;
    this.isProduction = appConfig.environment === 'production';
  }

  /**
   * Checks if the log level should be printed
   * @param level Log level to check
   * @returns True if should log
   */
  private shouldLog(level: LogLevel): boolean {
    const currentLevel = LOG_LEVELS[this.logLevel.toUpperCase() as keyof typeof LOG_LEVELS];
    const messageLevel = LOG_LEVELS[level.toUpperCase() as keyof typeof LOG_LEVELS];
    
    return messageLevel >= currentLevel;
  }

  /**
   * Creates a formatted log entry
   * @param level Log level
   * @param message Log message
   * @param data Additional data to log
   * @param context Optional context string
   * @returns Formatted log entry
   */
  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined,
      context,
    };
  }

  /**
   * Formats log entry for console output
   * @param entry Log entry to format
   * @returns Formatted string
   */
  private formatLogEntry(entry: LogEntry): string {
    const contextStr = entry.context ? `[${entry.context}] ` : '';
    const dataStr = entry.data ? `\nData: ${entry.data}` : '';
    
    return `${entry.timestamp} [${entry.level.toUpperCase()}] ${contextStr}${entry.message}${dataStr}`;
  }

  /**
   * Debug level logging
   * @param message Debug message
   * @param data Additional data to log
   * @param context Optional context string
   */
  public debug(message: string, data?: any, context?: string): void {
    if (!this.shouldLog('debug')) return;

    const entry = this.createLogEntry('debug', message, data, context);
    
    if (!this.isProduction) {
      console.log(`🐛 ${this.formatLogEntry(entry)}`);
    }
  }

  /**
   * Info level logging
   * @param message Info message
   * @param data Additional data to log
   * @param context Optional context string
   */
  public info(message: string, data?: any, context?: string): void {
    if (!this.shouldLog('info')) return;

    const entry = this.createLogEntry('info', message, data, context);
    
    console.info(`ℹ️ ${this.formatLogEntry(entry)}`);
  }

  /**
   * Warning level logging
   * @param message Warning message
   * @param data Additional data to log
   * @param context Optional context string
   */
  public warn(message: string, data?: any, context?: string): void {
    if (!this.shouldLog('warn')) return;

    const entry = this.createLogEntry('warn', message, data, context);
    
    console.warn(`⚠️ ${this.formatLogEntry(entry)}`);
  }

  /**
   * Error level logging
   * @param message Error message
   * @param error Error object or additional data
   * @param context Optional context string
   */
  public error(message: string, error?: Error | any, context?: string): void {
    if (!this.shouldLog('error')) return;

    const errorData = error instanceof Error 
      ? { 
          name: error.name, 
          message: error.message, 
          stack: error.stack 
        }
      : error;

    const entry = this.createLogEntry('error', message, errorData, context);
    
    console.error(`🚫 ${this.formatLogEntry(entry)}`);
  }

  /**
   * API request logging
   * @param method HTTP method
   * @param url Request URL
   * @param data Request data
   * @param context Optional context
   */
  public apiRequest(method: string, url: string, data?: any, context?: string): void {
    this.debug(
      `API Request: ${method.toUpperCase()} ${url}`,
      { requestData: data },
      context || 'API'
    );
  }

  /**
   * API response logging
   * @param method HTTP method
   * @param url Request URL
   * @param status Response status
   * @param data Response data
   * @param context Optional context
   */
  public apiResponse(method: string, url: string, status: number, data?: any, context?: string): void {
    const logLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'debug';
    
    this[logLevel](
      `API Response: ${method.toUpperCase()} ${url} - ${status}`,
      { responseData: data },
      context || 'API'
    );
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();
