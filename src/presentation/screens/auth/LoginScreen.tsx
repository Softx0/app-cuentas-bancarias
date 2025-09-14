/**
 * @fileoverview Login Screen for banking app authentication
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ReusableButton from '../../../../components/custom-button/ReusableButton';
import InputTextReusable from '../../../../components/custom-input/InputTextReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import { Colors, Metrics } from '../../../../themes';
import { useAuth } from '../../../context/auth/AuthContext';
import { handleJavaScriptError, handleValidationErrors } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

/**
 * Login form validation interface
 */
interface LoginFormErrors {
  email?: string;
  password?: string;
}

/**
 * Login form state interface
 */
interface LoginFormState {
  email: string;
  password: string;
  errors: LoginFormErrors;
  isSubmitting: boolean;
}

/**
 * LoginScreen Component
 * Handles user authentication with comprehensive error handling
 */
export const LoginScreen: React.FC = () => {
  // Auth context
  const { login } = useAuth();

  // Form state
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    errors: {},
    isSubmitting: false,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    isError: false,
  });


  /**
   * Reset form when screen gains focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('🔐 Login screen focused', undefined, 'LOGIN_SCREEN');
      setFormState(prev => ({
        ...prev,
        errors: {},
        isSubmitting: false,
      }));
    }, [])
  );

  /**
   * Validates form fields
   */
  const validateForm = useCallback((): boolean => {
    const errors: LoginFormErrors = {};
    let isValid = true;

    // Email validation
    if (!formState.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = 'Formato de correo electrónico inválido';
      isValid = false;
    }

    // Password validation
    if (!formState.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formState.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setFormState(prev => ({ ...prev, errors }));

    if (!isValid) {
      const errorList = Object.values(errors).filter(Boolean);
      const userMessage = handleValidationErrors(errorList as any[]);
      showSnackbar(userMessage.message, true);
    }

    return isValid;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.email, formState.password]);

  /**
   * Shows snackbar message
   */
  const showSnackbar = useCallback((message: string, isError: boolean = false) => {
    setSnackbar({ visible: true, message, isError });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  /**
   * Updates form field value
   */
  const updateField = useCallback((field: keyof LoginFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: undefined }, // Clear field error
    }));
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      logger.info('🔐 Login attempt started', { email: formState.email }, 'LOGIN_SCREEN');

      // Validate form
      if (!validateForm()) {
        return;
      }

      setFormState(prev => ({ ...prev, isSubmitting: true }));

      // Call authentication context login
      await login(formState.email.trim().toLowerCase(), formState.password);

      // If we get here, login was successful - navigation will be handled automatically by RootNavigation
      logger.info('✅ Login successful', { email: formState.email }, 'LOGIN_SCREEN');
      showSnackbar('Inicio de sesión exitoso', false);

    } catch (error) {
      // Handle unexpected errors
      const userMessage = handleJavaScriptError(error as Error, {
        screen: 'LoginScreen',
        action: 'login'
      });
      showSnackbar(userMessage.message, true);
      
      logger.error('💥 Login error', error, 'LOGIN_SCREEN');
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.email, formState.password, validateForm, showSnackbar, login]);

  /**
   * Handles forgot password
   */
  const handleForgotPassword = useCallback(() => {
    logger.info('🔑 Forgot password pressed', undefined, 'LOGIN_SCREEN');
    
    Alert.alert(
      'Recuperar Contraseña',
      'Esta funcionalidad no está disponible de momento. Por favor, contacta soporte.',
      [{ text: 'Entendido' }]
    );
  }, []);

  /**
   * Navigates to register screen
   */
  const handleNavigateToRegister = useCallback(() => {
    logger.info('📝 Navigate to register', undefined, 'LOGIN_SCREEN');
    // TODO: Implement navigation to register screen
    Alert.alert('Registro', 'Navegación a registro no implementada aún');
  }, []);

  /**
   * Computed styles
   */
  const computedStyles = useMemo(() => ({
    submitButton: {
      opacity: formState.isSubmitting ? 0.6 : 1,
    },
  }), [formState.isSubmitting]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa a tu cuenta bancaria de forma segura
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <InputTextReusable
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={formState.email}
            onChangeText={(value: string) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.email}
            style={styles.input}
          />

          {/* Password Input */}
          <InputTextReusable
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={formState.password}
            onChangeText={(value: string) => updateField('password', value)}
            secureTextEntry={true}
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.password}
            style={styles.input}
          />

          {/* Forgot Password Link */}
          <ReusableButton
            titleButton="¿Olvidaste tu contraseña?"
            onPressActionButton={handleForgotPassword}
            buttonStyle={[styles.forgotPasswordButton, { backgroundColor: 'transparent' }]}
            textButtonStyle={{ color: Colors.primary[400] }}
            disabled={formState.isSubmitting}
          />

          {/* Submit Button */}
          <ReusableButton
            titleButton={formState.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            onPressActionButton={handleSubmit}
            buttonStyle={[styles.submitButton, computedStyles.submitButton, { backgroundColor: Colors.primary[400] }]}
            textButtonStyle={{ color: Colors.white }}
            disabled={formState.isSubmitting}
            loading={formState.isSubmitting}
          />

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{`¿No tienes una cuenta?`}</Text>
            
            <ReusableButton
              titleButton="Regístrate aquí"
              onPressActionButton={handleNavigateToRegister}
              buttonStyle={[styles.registerButton, { backgroundColor: 'transparent' }]}
              textButtonStyle={{ color: Colors.primary[400] }}
              disabled={formState.isSubmitting}
            />
            
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {formState.isSubmitting && (
        <CustomLoading
          size="large"
          color={Colors.primary[400]}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        backgroundColorSnack={snackbar.isError ? Colors.feedback.error[100] : Colors.feedback.success[100]}
        messageTextStyle={{ 
          color: snackbar.isError ? Colors.feedback.error[300] : Colors.feedback.success[300] 
        }}
        duration={3000}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Metrics.large,
    paddingVertical: Metrics.xLarge,
  },
  header: {
    marginBottom: Metrics.xLarge,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: Metrics.medium,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: Metrics.large,
    paddingVertical: Metrics.small,
  },
  submitButton: {
    marginBottom: Metrics.large,
    paddingVertical: Metrics.medium,
  },
  registerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // flexWrap: 'wrap',
  },
  registerText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  registerButton: {
    paddingVertical: Metrics.small,
    paddingHorizontal: 0,
  },
});

export default LoginScreen;
