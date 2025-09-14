/**
 * @fileoverview Accessibility enhancement provider for banking app
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  AccessibilityRole,
  AccessibilityState,
  Dimensions,
  Platform
} from 'react-native';

import { logger } from '../../infrastructure/utils/logger';

/**
 * Accessibility context interface
 */
interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isHighContrastEnabled: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  screenDimensions: { width: number; height: number };
  announceForAccessibility: (message: string) => void;
  setFocusToElementWithId: (id: string) => void;
}

/**
 * Accessibility context
 */
const AccessibilityContext = createContext<AccessibilityContextType>({
  isScreenReaderEnabled: false,
  isReduceMotionEnabled: false,
  isHighContrastEnabled: false,
  fontSize: 'normal',
  screenDimensions: { width: 0, height: 0 },
  announceForAccessibility: () => {},
  setFocusToElementWithId: () => {},
});

/**
 * Accessibility provider props
 */
interface AccessibilityProviderProps {
  children: React.ReactNode;
  enableLogging?: boolean;
}

/**
 * Accessibility Provider Component
 * Provides accessibility context and utilities throughout the app
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  enableLogging = __DEV__,
}) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');
  const [screenDimensions, setScreenDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  /**
   * Initialize accessibility settings
   */
  useEffect(() => {
    const initializeAccessibility = async () => {
      try {
        // Check screen reader status
        const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(screenReaderEnabled);

        if (enableLogging) {
          logger.info('♿ Accessibility settings initialized', {
            screenReaderEnabled,
            platform: Platform.OS,
          }, 'ACCESSIBILITY');
        }

        // Check for reduce motion preference (iOS only)
        if (Platform.OS === 'ios') {
          const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled?.();
          if (reduceMotionEnabled !== undefined) {
            setIsReduceMotionEnabled(reduceMotionEnabled);
          }
        }

        // Check for high contrast preference (Android only)
        if (Platform.OS === 'android') {
          // This would require additional native module for Android high contrast detection
          // For now, we'll leave it as false
        }

      } catch (error) {
        if (enableLogging) {
          logger.error('❌ Failed to initialize accessibility settings', error, 'ACCESSIBILITY');
        }
      }
    };

    initializeAccessibility();

    // Set up listeners for accessibility changes
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        setIsScreenReaderEnabled(enabled);
        if (enableLogging) {
          logger.info('♿ Screen reader status changed', { enabled }, 'ACCESSIBILITY');
        }
      }
    );

    // iOS-specific reduce motion listener
    let reduceMotionChangedSubscription: any = null;
    if (Platform.OS === 'ios' && AccessibilityInfo.addEventListener) {
      try {
        reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
          'reduceMotionChanged' as any,
          (enabled: boolean) => {
            setIsReduceMotionEnabled(enabled);
            if (enableLogging) {
              logger.info('♿ Reduce motion status changed', { enabled }, 'ACCESSIBILITY');
            }
          }
        );
      } catch (error) {
        // Reduce motion listener may not be available on all iOS versions
      }
    }

    // Screen dimension changes
    const dimensionSubscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions({ width: window.width, height: window.height });
      if (enableLogging) {
        logger.debug('📱 Screen dimensions changed', window, 'ACCESSIBILITY');
      }
    });

    return () => {
      screenReaderChangedSubscription?.remove();
      reduceMotionChangedSubscription?.remove();
      dimensionSubscription?.remove();
    };
  }, [enableLogging]);

  /**
   * Announces message for screen readers
   */
  const announceForAccessibility = (message: string) => {
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
      if (enableLogging) {
        logger.debug('📢 Accessibility announcement', { message }, 'ACCESSIBILITY');
      }
    }
  };

  /**
   * Sets focus to element with specific ID
   * Note: In React Native 0.81+, AccessibilityInfo.setAccessibilityFocus requires a node handle (number)
   * This function needs to be updated to work with refs when actually used
   */
  const setFocusToElementWithId = (id: string) => {
    if (isScreenReaderEnabled) {
      // TODO: Update this to use findNodeHandle with a ref instead of string ID
      // AccessibilityInfo.setAccessibilityFocus requires a node handle in RN 0.81+
      if (enableLogging) {
        logger.debug('🎯 Accessibility focus requested (needs ref implementation)', { id }, 'ACCESSIBILITY');
      }
    }
  };

  const contextValue: AccessibilityContextType = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isHighContrastEnabled,
    fontSize,
    screenDimensions,
    announceForAccessibility,
    setFocusToElementWithId,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * Accessibility-enhanced component props
 */
export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityActions?: Array<{
    name: string;
    label: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
  accessible?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityElementsHidden?: boolean;
  accessibilityViewIsModal?: boolean;
}

/**
 * Enhanced TouchableOpacity with accessibility features
 */
export const AccessibleTouchable: React.FC<
  React.ComponentProps<any> & AccessibilityProps & {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    announcement?: string;
  }
> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  announcement,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  ...props
}) => {
  const { announceForAccessibility, isScreenReaderEnabled } = useAccessibility();
  const TouchableOpacity = require('react-native').TouchableOpacity;

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
      
      // Announce action completion if specified
      if (announcement && isScreenReaderEnabled) {
        setTimeout(() => {
          announceForAccessibility(announcement);
        }, 100);
      }
    }
  };

  const enhancedAccessibilityState = {
    disabled: disabled || loading,
    busy: loading,
    ...accessibilityState,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint || (loading ? 'Cargando, por favor espera' : undefined)}
      accessibilityRole={accessibilityRole}
      accessibilityState={enhancedAccessibilityState}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * Accessible text input with enhanced features
 */
export const AccessibleTextInput: React.FC<
  React.ComponentProps<any> & AccessibilityProps & {
    label?: string;
    error?: string;
    required?: boolean;
    onChangeText?: (text: string) => void;
    value?: string;
  }
> = ({
  label,
  error,
  required = false,
  onChangeText,
  value,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { announceForAccessibility } = useAccessibility();
  const TextInput = require('react-native').TextInput;

  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const enhancedAccessibilityLabel = accessibilityLabel || label;
  const enhancedAccessibilityHint = accessibilityHint || 
    (error ? `Error: ${error}` : (required ? 'Campo requerido' : undefined));

  return (
    <TextInput
      value={value}
      onChangeText={handleChangeText}
      accessible={true}
      accessibilityLabel={enhancedAccessibilityLabel}
      accessibilityHint={enhancedAccessibilityHint}
      accessibilityRole="text"
      accessibilityState={{ 
        invalid: !!error,
      }}
      {...props}
    />
  );
};

/**
 * Accessible loading indicator
 */
export const AccessibleLoading: React.FC<{
  message?: string;
  visible?: boolean;
}> = ({
  message = 'Cargando contenido, por favor espera',
  visible = true,
}) => {
  const { announceForAccessibility, isScreenReaderEnabled } = useAccessibility();

  useEffect(() => {
    if (visible && isScreenReaderEnabled) {
      announceForAccessibility(message);
    }
  }, [visible, message, isScreenReaderEnabled, announceForAccessibility]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      style={{ position: 'absolute', left: '-9999px' }}
    >
      {message}
    </div>
  );
};

/**
 * Banking-specific accessibility helpers
 */
export const BankingAccessibilityHelpers = {
  /**
   * Formats currency for screen readers
   */
  formatCurrencyForScreenReader: (amount: number, currency: string = 'COP'): string => {
    const formattedAmount = amount.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return `${formattedAmount} pesos colombianos`;
  },

  /**
   * Formats account number for screen readers
   */
  formatAccountNumberForScreenReader: (accountNumber: string): string => {
    const digits = accountNumber.replace(/\D/g, '');
    const lastFour = digits.slice(-4);
    return `Cuenta terminada en ${lastFour.split('').join(' ')}`;
  },

  /**
   * Formats transaction for screen readers
   */
  formatTransactionForScreenReader: (transaction: {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: Date;
  }): string => {
    const typeText = transaction.type === 'credit' ? 'Ingreso' : 'Egreso';
    const amountText = BankingAccessibilityHelpers.formatCurrencyForScreenReader(transaction.amount);
    const dateText = transaction.date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return `${typeText} de ${amountText}, ${transaction.description}, ${dateText}`;
  },

  /**
   * Announces successful banking operation
   */
  announceSuccess: (operation: string, details?: string) => {
    return `${operation} completada exitosamente${details ? `, ${details}` : ''}`;
  },

  /**
   * Announces banking error
   */
  announceError: (operation: string, error?: string) => {
    return `Error en ${operation}${error ? `: ${error}` : ''}`;
  },
};

console.log('♿ Accessibility provider and helpers initialized');

export default AccessibilityProvider;
