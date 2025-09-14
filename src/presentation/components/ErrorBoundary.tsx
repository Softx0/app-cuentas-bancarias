/**
 * @fileoverview Global Error Boundary component for handling React errors
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import ReusableButton from '../../../components/custom-button/ReusableButton';
import HayErrorResultadosReusable from '../../../components/hay-error-resultados/HayErrorResultadosReusable';
import { Colors } from '../../../themes';
import { logger } from '../../infrastructure/utils/logger';

// Type assertion for JavaScript component
const ErrorResultsComponent = HayErrorResultadosReusable as any;

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Error fallback component props
 */
export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
  errorId: string;
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  resetError,
  errorId,
}) => {
  const handleSendReport = () => {
    Alert.alert(
      '¿Enviar reporte de error?',
      'Esto nos ayudará a mejorar la aplicación. No se enviará información personal.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            logger.error('User reported error', {
              errorId,
              message: error.message,
              stack: error.stack,
              componentStack: errorInfo.componentStack,
            }, 'ERROR_BOUNDARY');
            
            Alert.alert('Gracias', 'El reporte ha sido enviado');
          },
        },
      ]
    );
  };

  const handleShowDetails = () => {
    Alert.alert(
      'Detalles del Error',
      `ID: ${errorId}\n\nError: ${error.message}\n\nStack: ${error.stack?.substring(0, 200)}...`,
      [{ text: 'Cerrar' }]
    );
  };

  return (
    <View style={styles.container}>
      <ErrorResultsComponent
        title="¡Ups! Algo salió mal"
        subtitle="Ocurrió un error inesperado. Puedes intentar nuevamente o contactar soporte."
        primaryButtonText="Reintentar"
        onPrimaryButtonPress={resetError}
        showSecondaryButton={true}
        secondaryButtonText="Reportar Error"
        onSecondaryButtonPress={handleSendReport}
      />
      
      <View style={styles.detailsContainer}>
        <ReusableButton
          titleButton="Ver Detalles"
          onPressActionButton={handleShowDetails}
          buttonStyle={{
            backgroundColor: 'transparent',
            marginBottom: 16,
            minWidth: 120,
          }}
          textButtonStyle={{
            color: Colors.primary[400],
          }}
        />
        
        <Text style={styles.errorId}>
          ID de Error: {errorId}
        </Text>
      </View>
    </View>
  );
};

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  /**
   * Static method to update state when an error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  /**
   * Lifecycle method called when an error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log the error
    logger.error('React Error Boundary caught error', {
      errorId: this.state.errorId,
      message: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    }, 'ERROR_BOUNDARY');

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        logger.error('Error in custom error handler', handlerError, 'ERROR_BOUNDARY');
      }
    }

    // Auto-reset after 10 seconds in development
    if (__DEV__) {
      this.resetTimeoutId = setTimeout(() => {
        this.resetError();
      }, 10000) as any;
    }
  }

  /**
   * Component cleanup
   */
  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Resets the error state
   */
  resetError = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });

    logger.info('Error boundary reset', { errorId: this.state.errorId }, 'ERROR_BOUNDARY');
  };

  /**
   * Renders the component
   */
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo!}
          resetError={this.resetError}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  detailsButton: {
    marginBottom: 16,
    minWidth: 120,
  },
  errorId: {
    fontSize: 12,
    color: Colors.error,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

export default ErrorBoundary;
