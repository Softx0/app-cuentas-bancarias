/**
 * @fileoverview Register Screen for banking app user registration
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

import ReusableButton from '../../../../components/custom-button/ReusableButton';
import CheckBoxReusable from '../../../../components/custom-checkbox/CheckBoxReusable';
import InputTextReusable from '../../../../components/custom-input/InputTextReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import { Colors, Metrics } from '../../../../themes';
import { mockAuthService } from '../../../infrastructure/services/mock/AuthService';
import type { RegisterRequest } from '../../../infrastructure/services/mock/types/ApiTypes';
import { handleApiError, handleJavaScriptError, handleValidationErrors } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

/**
 * Register form validation interface
 */
interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

/**
 * Register form state interface
 */
interface RegisterFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  errors: RegisterFormErrors;
  isSubmitting: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

/**
 * RegisterScreen Component
 * Handles user registration with comprehensive validation and error handling
 */
export const RegisterScreen: React.FC = () => {
  // Form state
  const [formState, setFormState] = useState<RegisterFormState>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    errors: {},
    isSubmitting: false,
    showPassword: false,
    showConfirmPassword: false,
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
      logger.info('📝 Register screen focused', undefined, 'REGISTER_SCREEN');
      setFormState(prev => ({
        ...prev,
        errors: {},
        isSubmitting: false,
      }));
    }, [])
  );

  /**
   * Validates form fields with comprehensive checks
   */
  const validateForm = useCallback((): boolean => {
    const errors: RegisterFormErrors = {};
    let isValid = true;

    // First name validation
    if (!formState.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
      isValid = false;
    } else if (formState.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formState.firstName.trim())) {
      errors.firstName = 'El nombre solo puede contener letras';
      isValid = false;
    }

    // Last name validation
    if (!formState.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
      isValid = false;
    } else if (formState.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formState.lastName.trim())) {
      errors.lastName = 'El apellido solo puede contener letras';
      isValid = false;
    }

    // Username validation
    if (!formState.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
      isValid = false;
    } else if (formState.username.trim().length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      isValid = false;
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formState.username.trim())) {
      errors.username = 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos';
      isValid = false;
    }

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
    } else if (formState.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formState.password)) {
      errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
      isValid = false;
    }

    // Confirm password validation
    if (!formState.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
      isValid = false;
    } else if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // Terms validation
    if (!formState.acceptedTerms) {
      errors.terms = 'Debes aceptar los términos y condiciones';
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
  }, [
    formState.firstName,
    formState.lastName,
    formState.username,
    formState.email,
    formState.password,
    formState.confirmPassword,
    formState.acceptedTerms
  ]);

  /**
   * Shows snackbar message
   */
  const showSnackbar = useCallback((message: string, isError: boolean = false) => {
    setSnackbar({ visible: true, message, isError });
    
    // Auto-hide after 4 seconds (longer for registration messages)
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, 4000);
  }, []);

  /**
   * Updates form field value and clears related errors
   */
  const updateField = useCallback((field: keyof RegisterFormState, value: string | boolean) => {
    setFormState(prev => {
      const newState = {
        ...prev,
        [field]: value,
        errors: { ...prev.errors },
      };

      // Clear related field errors
      if (field === 'firstName') delete newState.errors.firstName;
      if (field === 'lastName') delete newState.errors.lastName;
      if (field === 'username') delete newState.errors.username;
      if (field === 'email') delete newState.errors.email;
      if (field === 'password') {
        delete newState.errors.password;
        if (prev.confirmPassword && value !== prev.confirmPassword) {
          newState.errors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newState.errors.confirmPassword;
        }
      }
      if (field === 'confirmPassword') {
        delete newState.errors.confirmPassword;
        if (prev.password && prev.password !== value) {
          newState.errors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
      if (field === 'acceptedTerms') delete newState.errors.terms;

      return newState;
    });
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      logger.info('📝 Registration attempt started', { 
        email: formState.email,
        username: formState.username,
      }, 'REGISTER_SCREEN');

      // Validate form
      if (!validateForm()) {
        return;
      }

      setFormState(prev => ({ ...prev, isSubmitting: true }));

      // Prepare registration data
      const registerData: RegisterRequest = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        username: formState.username.trim().toLowerCase(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
      };

      // Call authentication service
      const response = await mockAuthService.register(registerData);

      if (response.success) {
        logger.info('✅ Registration successful', { 
          userId: response.data.user.id,
          email: response.data.user.email,
        }, 'REGISTER_SCREEN');
        
        showSnackbar('¡Cuenta creada exitosamente! Iniciando sesión...', false);
        
        // Show success alert and navigate
        setTimeout(() => {
          Alert.alert(
            '¡Bienvenido!',
            `Hola ${response.data.user.firstName}, tu cuenta ha sido creada exitosamente. Ya puedes comenzar a usar la aplicación.`,
            [{ 
              text: 'Continuar',
              onPress: () => {
                // TODO: Navigate to main app screens
                // TODO: Store authentication tokens
                // TODO: Update global auth state
                logger.info('🏠 Navigating to main app after registration', undefined, 'REGISTER_SCREEN');
              }
            }]
          );
        }, 1500);

      } else {
        // Handle API error
        const userMessage = handleApiError(response, {
          screen: 'RegisterScreen',
          action: 'register'
        });
        showSnackbar(userMessage.message, true);
        
        logger.warn('❌ Registration failed', { error: response.error }, 'REGISTER_SCREEN');
      }

    } catch (error) {
      // Handle unexpected errors
      const userMessage = handleJavaScriptError(error as Error, {
        screen: 'RegisterScreen',
        action: 'register'
      });
      showSnackbar(userMessage.message, true);
      
      logger.error('💥 Registration error', error, 'REGISTER_SCREEN');
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [
    formState.firstName,
    formState.lastName,
    formState.username,
    formState.email,
    formState.password,
    formState.confirmPassword,
    validateForm,
    showSnackbar
  ]);

  /**
   * Navigates back to login screen
   */
  const handleNavigateToLogin = useCallback(() => {
    logger.info('🔐 Navigate to login', undefined, 'REGISTER_SCREEN');
    // TODO: Implement navigation to login screen
    Alert.alert('Iniciar Sesión', 'Navegación a login no implementada aún');
  }, []);

  /**
   * Shows terms and conditions
   */
  const handleShowTerms = useCallback(() => {
    logger.info('📋 Show terms and conditions', undefined, 'REGISTER_SCREEN');
    
    Alert.alert(
      'Términos y Condiciones',
      'Al crear una cuenta, aceptas nuestros términos y condiciones de uso, así como nuestra política de privacidad.',
      [{ text: 'Entendido' }]
    );
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
    <KeyboardAvoidingView 
      style={styles.container} 
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para acceder a todos los servicios bancarios
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <InputTextReusable
            label="Nombre"
            placeholder="Tu nombre"
            value={formState.firstName}
            onChangeText={(value: string) => updateField('firstName', value)}
            autoCapitalize="words"
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.firstName}
            style={styles.input}
          />

          <InputTextReusable
            label="Apellido"
            placeholder="Tu apellido"
            value={formState.lastName}
            onChangeText={(value: string) => updateField('lastName', value)}
            autoCapitalize="words"
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.lastName}
            style={styles.input}
          />

          {/* Account Information */}
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>

          <InputTextReusable
            label="Nombre de Usuario"
            placeholder="usuario123"
            value={formState.username}
            onChangeText={(value: string) => updateField('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.username}
            style={styles.input}
          />

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

          {/* Security Information */}
          <Text style={styles.sectionTitle}>Seguridad</Text>

          <InputTextReusable
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={formState.password}
            onChangeText={(value: string) => updateField('password', value)}
            secureTextEntry={true}
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.password}
            style={styles.input}
          />

          <InputTextReusable
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={formState.confirmPassword}
            onChangeText={(value: string) => updateField('confirmPassword', value)}
            secureTextEntry={true}
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.confirmPassword}
            style={styles.input}
          />

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <CheckBoxReusable
              checked={formState.acceptedTerms}
              onPress={(checked: boolean) => updateField('acceptedTerms', checked)}
              disabled={formState.isSubmitting}
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                Acepto los{' '}
                <Text style={styles.termsLink} onPress={handleShowTerms}>
                  términos y condiciones
                </Text>
                {' '}y la política de privacidad
              </Text>
              {formState.errors.terms && (
                <Text style={styles.errorText}>{formState.errors.terms}</Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <ReusableButton
            titleButton={formState.isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            onPressActionButton={handleSubmit}
            buttonStyle={[styles.submitButton, computedStyles.submitButton, { backgroundColor: Colors.primary[400] }]}
            textButtonStyle={{ color: Colors.white }}
            disabled={formState.isSubmitting}
            loading={formState.isSubmitting}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <ReusableButton
              titleButton="Inicia sesión aquí"
              onPressActionButton={handleNavigateToLogin}
              buttonStyle={[styles.loginButton, { backgroundColor: 'transparent' }]}
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
        duration={4000}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    marginTop: Metrics.large,
  },
  input: {
    marginBottom: Metrics.medium,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Metrics.large,
    paddingHorizontal: Metrics.small,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: Metrics.small,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary[400],
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    color: Colors.feedback.error[300],
    marginTop: Metrics.small,
  },
  submitButton: {
    marginBottom: Metrics.large,
    paddingVertical: Metrics.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: Metrics.xLarge,
  },
  loginText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loginButton: {
    paddingVertical: Metrics.small,
    paddingHorizontal: 0,
  },
});

export default RegisterScreen;
