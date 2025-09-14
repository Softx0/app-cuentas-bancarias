/**
 * @fileoverview Enhanced Error Boundary Provider for banking app
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ReusableButton from '../../../components/custom-button/ReusableButton';
import Colors from '../../../themes/Colors';
import Metrics from '../../../themes/Metrics';
import { logger } from '../../infrastructure/utils/logger';

/**
 * Enhanced error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  lastErrorTime: number;
}

/**
 * Error boundary props interface
 */
interface ErrorBoundaryProviderProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  resetTimeout?: number;
  showErrorDetails?: boolean;
}

/**
 * Error fallback component props
 */
export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  errorId: string;
  retryCount: number;
  onRetry: () => void;
  onReportError: () => void;
  showDetails: boolean;
  onToggleDetails: () => void;
}

/**
 * Enhanced Error Boundary Provider
 * Provides comprehensive error handling with retry logic, error reporting, and fallback UI
 */
export class ErrorBoundaryProvider extends Component<ErrorBoundaryProviderProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProviderProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
      lastErrorTime: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    // Enhanced error logging
    logger.error('🚨 Error Boundary Caught Error', {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundaryProvider',
      retryCount: this.state.retryCount,
      timestamp: new Date().toISOString(),
    }, 'ERROR_BOUNDARY');

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo, errorId);
    }

    // Auto-retry logic for transient errors
    this.handleAutoRetry();
  }

  /**
   * Handles automatic retry for transient errors
   */
  private handleAutoRetry = () => {
    const { maxRetries = 2, resetTimeout = 5000 } = this.props;
    const { retryCount } = this.state;

    // Check if we should attempt auto-retry
    if (retryCount < maxRetries) {
      // Clear any existing timeout
      if (this.retryTimeoutId) {
        clearTimeout(this.retryTimeoutId);
      }

      // Set timeout for auto-retry
      this.retryTimeoutId = setTimeout(() => {
        logger.info('🔄 Auto-retrying after error', {
          retryCount: retryCount + 1,
          maxRetries,
        }, 'ERROR_BOUNDARY');

        this.handleRetry();
      }, resetTimeout);
    }
  };

  /**
   * Handles manual retry
   */
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      Alert.alert(
        'Límite de Reintentos Alcanzado',
        'Por favor reinicia la aplicación si el problema persiste.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    logger.info('🔄 Manual retry triggered', {
      retryCount: retryCount + 1,
      maxRetries,
    }, 'ERROR_BOUNDARY');

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: prevState.retryCount + 1,
      lastErrorTime: 0,
    }));

    // Clear retry timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  };

  /**
   * Handles error reporting
   */
  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;

    if (!error || !errorInfo) return;

    // In a real app, this would send to a crash reporting service
    logger.error('📤 Error reported by user', {
      errorId,
      userAgent: 'ReactNative',
      reportedAt: new Date().toISOString(),
    }, 'ERROR_BOUNDARY');

    Alert.alert(
      'Error Reportado',
      'Gracias por reportar este error. Nuestro equipo ha sido notificado.',
      [{ text: 'Entendido' }]
    );
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const { children, fallback: FallbackComponent, showErrorDetails = __DEV__ } = this.props;
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;

    if (hasError && error && errorInfo) {
      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            errorId={errorId}
            retryCount={retryCount}
            onRetry={this.handleRetry}
            onReportError={this.handleReportError}
            showDetails={showErrorDetails}
            onToggleDetails={() => {}}
          />
        );
      }

      // Default error fallback UI
      return <DefaultErrorFallback 
        error={error}
        errorInfo={errorInfo}
        errorId={errorId}
        retryCount={retryCount}
        onRetry={this.handleRetry}
        onReportError={this.handleReportError}
        showDetails={showErrorDetails}
      />;
    }

    return children;
  }
}

/**
 * Default Error Fallback Component
 */
const DefaultErrorFallback: React.FC<Omit<ErrorFallbackProps, 'onToggleDetails'> & { showDetails: boolean }> = ({
  error,
  errorInfo,
  errorId,
  retryCount,
  onRetry,
  onReportError,
  showDetails,
}) => {
  const [detailsVisible, setDetailsVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Algo salió mal</Text>
        <Text style={styles.errorMessage}>
          La aplicación encontró un error inesperado. Puedes intentar nuevamente o reportar el problema.
        </Text>
        
        {retryCount > 0 && (
          <Text style={styles.retryInfo}>
            Intentos realizados: {retryCount}/3
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <ReusableButton
            titleButton="Intentar Nuevamente"
            onPressActionButton={onRetry}
            buttonStyle={styles.retryButton}
            textButtonStyle={styles.retryButtonText}
          />
          
          <ReusableButton
            titleButton="Reportar Error"
            onPressActionButton={onReportError}
            buttonStyle={styles.reportButton}
            textButtonStyle={styles.reportButtonText}
          />
        </View>

        {showDetails && (
          <TouchableOpacity 
            style={styles.detailsToggle}
            onPress={() => setDetailsVisible(!detailsVisible)}
          >
            <Text style={styles.detailsToggleText}>
              {detailsVisible ? '📋 Ocultar Detalles' : '🔍 Mostrar Detalles Técnicos'}
            </Text>
          </TouchableOpacity>
        )}

        {detailsVisible && showDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Detalles del Error:</Text>
            <Text style={styles.errorId}>ID: {errorId}</Text>
            <Text style={styles.errorDetails}>{error.message}</Text>
            {error.stack && (
              <Text style={styles.stackTrace}>{error.stack.substring(0, 500)}...</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.large,
  },
  errorContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Metrics.xLarge,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Metrics.large,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.feedback.error[300],
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Metrics.xLarge,
  },
  retryInfo: {
    fontSize: 14,
    color: Colors.feedback.info[300],
    marginBottom: Metrics.large,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Metrics.medium,
    marginBottom: Metrics.large,
  },
  retryButton: {
    backgroundColor: Colors.primary[400],
    paddingHorizontal: Metrics.large,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
    flex: 1,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  reportButton: {
    backgroundColor: Colors.feedback.error[300],
    paddingHorizontal: Metrics.large,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
    flex: 1,
  },
  reportButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsToggle: {
    paddingVertical: Metrics.medium,
    paddingHorizontal: Metrics.large,
    marginBottom: Metrics.medium,
  },
  detailsToggleText: {
    fontSize: 14,
    color: Colors.primary[400],
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: Colors.neutral[100],
    padding: Metrics.medium,
    borderRadius: 8,
    width: '100%',
    maxHeight: 200,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  errorId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: Metrics.small,
  },
  errorDetails: {
    fontSize: 12,
    color: Colors.feedback.error[300],
    marginBottom: Metrics.small,
  },
  stackTrace: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
});

export default ErrorBoundaryProvider;
