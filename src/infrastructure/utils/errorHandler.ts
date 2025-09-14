/**
 * @fileoverview Global error handling utilities for banking app
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { Alert } from 'react-native';
import { ERROR_CODES, HTTP_STATUS } from '../../shared/constants';
import { logger } from './logger';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * User-friendly error message interface
 */
export interface UserErrorMessage {
  title: string;
  message: string;
  actionLabel?: string;
  canRetry: boolean;
  shouldLogout?: boolean;
  severity: ErrorSeverity;
}

/**
 * Error context interface
 */
export interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  additional?: Record<string, any>;
}

/**
 * Error handling configuration
 */
interface ErrorHandlerConfig {
  enableUserAlerts: boolean;
  enableLogging: boolean;
  enableReporting: boolean;
  showStackTrace: boolean;
}

/**
 * Global error handler class
 */
class GlobalErrorHandler {
  private config: ErrorHandlerConfig = {
    enableUserAlerts: true,
    enableLogging: true,
    enableReporting: false,
    showStackTrace: __DEV__,
  };

  /**
   * Updates error handler configuration
   * @param newConfig Partial configuration to update
   */
  public configure(newConfig: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Error handler configuration updated', newConfig, 'ERROR_HANDLER');
  }

  /**
   * Maps HTTP status codes to user-friendly messages
   * @param statusCode HTTP status code
   * @returns User error message
   */
  private mapHttpStatusToUserMessage(statusCode: number): UserErrorMessage {
    const statusMessages: Record<number, UserErrorMessage> = {
      [HTTP_STATUS.BAD_REQUEST]: {
        title: 'Solicitud incorrecta',
        message: 'Los datos enviados no son válidos. Verifica la información e intenta nuevamente.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [HTTP_STATUS.UNAUTHORIZED]: {
        title: 'Sesión expirada',
        message: 'Tu sesión ha expirado. Inicia sesión nuevamente para continuar.',
        shouldLogout: true,
        canRetry: false,
        severity: ErrorSeverity.HIGH,
      },
      [HTTP_STATUS.FORBIDDEN]: {
        title: 'Acceso denegado',
        message: 'No tienes permisos para realizar esta acción.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [HTTP_STATUS.NOT_FOUND]: {
        title: 'No encontrado',
        message: 'La información solicitada no fue encontrada.',
        actionLabel: 'Actualizar',
        canRetry: true,
        severity: ErrorSeverity.LOW,
      },
      [HTTP_STATUS.CONFLICT]: {
        title: 'Conflicto',
        message: 'La información ya existe o hay un conflicto con los datos.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [HTTP_STATUS.UNPROCESSABLE_ENTITY]: {
        title: 'Datos inválidos',
        message: 'Los datos proporcionados no son válidos. Verifica e intenta nuevamente.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [HTTP_STATUS.TOO_MANY_REQUESTS]: {
        title: 'Demasiadas solicitudes',
        message: 'Has realizado demasiadas solicitudes. Espera un momento e intenta nuevamente.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.MEDIUM,
      },
      [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
        title: 'Error del servidor',
        message: 'Ocurrió un error en nuestros servidores. Intenta más tarde.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.HIGH,
      },
      [HTTP_STATUS.SERVICE_UNAVAILABLE]: {
        title: 'Servicio no disponible',
        message: 'El servicio está temporalmente no disponible. Intenta más tarde.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.HIGH,
      },
    };

    return statusMessages[statusCode] || {
      title: 'Error desconocido',
      message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      actionLabel: 'Reintentar',
      canRetry: true,
      severity: ErrorSeverity.MEDIUM,
    };
  }

  /**
   * Maps error codes to user-friendly messages
   * @param errorCode Error code
   * @returns User error message
   */
  private mapErrorCodeToUserMessage(errorCode: string): UserErrorMessage {
    const codeMessages: Record<string, UserErrorMessage> = {
      [ERROR_CODES.NETWORK_ERROR]: {
        title: 'Sin conexión',
        message: 'Verifica tu conexión a internet e intenta nuevamente.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.HIGH,
      },
      [ERROR_CODES.TIMEOUT_ERROR]: {
        title: 'Tiempo agotado',
        message: 'La solicitud tardó demasiado en responder. Intenta nuevamente.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.MEDIUM,
      },
      [ERROR_CODES.INVALID_CREDENTIALS]: {
        title: 'Credenciales incorrectas',
        message: 'El email o contraseña son incorrectos. Verifica e intenta nuevamente.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [ERROR_CODES.ACCOUNT_LOCKED]: {
        title: 'Cuenta bloqueada',
        message: 'Tu cuenta ha sido bloqueada temporalmente por seguridad.',
        canRetry: false,
        severity: ErrorSeverity.HIGH,
      },
      [ERROR_CODES.INSUFFICIENT_FUNDS]: {
        title: 'Fondos insuficientes',
        message: 'No tienes suficiente saldo para completar esta transacción.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [ERROR_CODES.ACCOUNT_NOT_FOUND]: {
        title: 'Cuenta no encontrada',
        message: 'La cuenta especificada no fue encontrada.',
        canRetry: false,
        severity: ErrorSeverity.MEDIUM,
      },
      [ERROR_CODES.TRANSACTION_FAILED]: {
        title: 'Transacción fallida',
        message: 'No se pudo completar la transacción. Intenta nuevamente.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.HIGH,
      },
    };

    return codeMessages[errorCode] || {
      title: 'Error',
      message: 'Ocurrió un error inesperado. Intenta nuevamente.',
      actionLabel: 'Reintentar',
      canRetry: true,
      severity: ErrorSeverity.MEDIUM,
    };
  }

  /**
   * Handles API errors and returns user-friendly message
   * @param error API error object
   * @param context Error context
   * @returns User error message
   */
  public handleApiError(error: any, context?: ErrorContext): UserErrorMessage {
    let userMessage: UserErrorMessage;
    let logLevel: 'warn' | 'error' = 'error';

    // Handle different error types
    if (error?.response) {
      // HTTP error response
      const statusCode = error.response.status;
      userMessage = this.mapHttpStatusToUserMessage(statusCode);
      
      if (statusCode < 500) {
        logLevel = 'warn'; // Client errors are warnings
      }
    } else if (error?.code) {
      // Structured API error
      userMessage = this.mapErrorCodeToUserMessage(error.code);
    } else if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
      // Network error
      userMessage = this.mapErrorCodeToUserMessage(ERROR_CODES.NETWORK_ERROR);
    } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      // Timeout error
      userMessage = this.mapErrorCodeToUserMessage(ERROR_CODES.TIMEOUT_ERROR);
    } else {
      // Unknown error
      userMessage = {
        title: 'Error inesperado',
        message: 'Ocurrió un error inesperado. Intenta nuevamente.',
        actionLabel: 'Reintentar',
        canRetry: true,
        severity: ErrorSeverity.MEDIUM,
      };
    }

    // Log the error
    if (this.config.enableLogging) {
      const logData = {
        error: {
          message: error?.message || 'Unknown error',
          code: error?.code,
          status: error?.response?.status,
          data: error?.response?.data,
        },
        context,
        userMessage: {
          title: userMessage.title,
          severity: userMessage.severity,
        },
      };

      if (logLevel === 'error') {
        logger.error('API error handled', logData, 'ERROR_HANDLER');
      } else {
        logger.warn('API error handled', logData, 'ERROR_HANDLER');
      }
    }

    return userMessage;
  }

  /**
   * Handles JavaScript errors
   * @param error JavaScript error
   * @param context Error context
   * @returns User error message
   */
  public handleJavaScriptError(error: Error, context?: ErrorContext): UserErrorMessage {
    const userMessage: UserErrorMessage = {
      title: 'Error de aplicación',
      message: 'Ocurrió un error en la aplicación. La página se recargará automáticamente.',
      actionLabel: 'Recargar',
      canRetry: true,
      severity: ErrorSeverity.HIGH,
    };

    if (this.config.enableLogging) {
      logger.error('JavaScript error handled', {
        error: {
          name: error.name,
          message: error.message,
          stack: this.config.showStackTrace ? error.stack : undefined,
        },
        context,
      }, 'ERROR_HANDLER');
    }

    return userMessage;
  }

  /**
   * Shows user-friendly error alert
   * @param userMessage User error message
   * @param onRetry Optional retry callback
   * @param onDismiss Optional dismiss callback
   */
  public showUserAlert(
    userMessage: UserErrorMessage,
    onRetry?: () => void,
    onDismiss?: () => void
  ): void {
    if (!this.config.enableUserAlerts) {
      return;
    }

    const buttons: any[] = [];

    // Add retry button if applicable
    if (userMessage.canRetry && onRetry) {
      buttons.push({
        text: userMessage.actionLabel || 'Reintentar',
        onPress: onRetry,
      });
    }

    // Add dismiss button
    buttons.push({
      text: 'Cerrar',
      style: 'cancel',
      onPress: onDismiss,
    });

    Alert.alert(
      userMessage.title,
      userMessage.message,
      buttons,
      { cancelable: false }
    );
  }

  /**
   * Handles validation errors
   * @param validationErrors Array of validation errors
   * @returns Formatted error message
   */
  public handleValidationErrors(validationErrors: any[]): UserErrorMessage {
    const errorCount = validationErrors.length;
    const firstError = validationErrors[0];

    let message = 'Corrige los siguientes errores:';
    if (errorCount === 1) {
      message = firstError.message || firstError;
    } else if (errorCount <= 3) {
      message = validationErrors.map(err => `• ${err.message || err}`).join('\n');
    } else {
      message = `${validationErrors.slice(0, 2).map(err => `• ${err.message || err}`).join('\n')}\n• Y ${errorCount - 2} errores más...`;
    }

    return {
      title: 'Datos inválidos',
      message,
      canRetry: false,
      severity: ErrorSeverity.LOW,
    };
  }

  /**
   * Reports error to external service (placeholder)
   * @param error Error to report
   * @param context Error context
   */
  public reportError(error: any, context?: ErrorContext): void {
    if (!this.config.enableReporting) {
      return;
    }

    // TODO: Implement error reporting to external service
    logger.info('Error reported to external service', { error, context }, 'ERROR_HANDLER');
  }
}

/**
 * Singleton error handler instance
 */
export const globalErrorHandler = new GlobalErrorHandler();

/**
 * Quick error handling functions
 */
export const handleApiError = (error: any, context?: ErrorContext): UserErrorMessage => {
  return globalErrorHandler.handleApiError(error, context);
};

export const handleJavaScriptError = (error: Error, context?: ErrorContext): UserErrorMessage => {
  return globalErrorHandler.handleJavaScriptError(error, context);
};

export const showErrorAlert = (
  userMessage: UserErrorMessage,
  onRetry?: () => void,
  onDismiss?: () => void
): void => {
  globalErrorHandler.showUserAlert(userMessage, onRetry, onDismiss);
};

export const handleValidationErrors = (validationErrors: any[]): UserErrorMessage => {
  return globalErrorHandler.handleValidationErrors(validationErrors);
};

console.log('🛡️ Global error handler initialized');
