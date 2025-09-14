/**
 * @fileoverview RegisterScreen - User registration form
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import CheckBoxReusable from '../../../../components/custom-checkbox/CheckBoxReusable';
import InputTextReusable from '../../../../components/custom-input/InputTextReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import { Colors, Metrics } from '../../../../themes';
import type { RootStackParamList } from '../../../../types/navigation';
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
}

/**
 * Snackbar state interface
 */
interface SnackbarState {
  visible: boolean;
  message: string;
  isError: boolean;
}

/**
 * RegisterScreen Component
 * Handles user registration with comprehensive validation and error handling
 */
// Navigation type for RegisterScreen
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  
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
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    isError: false,
  });

  /**
   * Focus effect for screen initialization
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('🔐 Register screen focused', undefined, 'REGISTER_SCREEN');
    }, [])
  );

  /**
   * Updates a single form field
   */
  const updateField = useCallback((field: keyof RegisterFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      // Clear field error when user starts typing
      ...(prev.errors[field as keyof RegisterFormErrors] && {
        errors: { ...prev.errors, [field]: undefined }
      }),
    }));
  }, []);

  /**
   * Validates the registration form
   */
  const validateForm = useCallback((): boolean => {
    const errors: RegisterFormErrors = {};

    // First name validation
    if (!formState.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    } else if (formState.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Last name validation
    if (!formState.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    } else if (formState.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    // Username validation
    if (!formState.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formState.username.trim().length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formState.username.trim())) {
      errors.username = 'Solo letras, números y guiones bajos permitidos';
    }

    // Email validation
    if (!formState.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      errors.email = 'El formato del correo no es válido';
    }

    // Password validation
    if (!formState.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formState.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formState.password)) {
      errors.password = 'Debe contener mayúsculas, minúsculas y números';
    }

    // Confirm password validation
    if (!formState.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Terms validation
    if (!formState.acceptedTerms) {
      errors.terms = 'Debes aceptar los términos y condiciones';
    }

    // Update form errors
    setFormState(prev => ({ ...prev, errors }));

    return Object.keys(errors).length === 0;
  }, [formState.firstName, formState.lastName, formState.username, formState.email, formState.password, formState.confirmPassword, formState.acceptedTerms]);

  /**
   * Shows a snackbar message
   */
  const showSnackbar = useCallback((message: string, isError: boolean = false) => {
    setSnackbar({ visible: true, message, isError });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, isError ? 4000 : 3000);
  }, []);

  // Password visibility toggle removed - InputTextReusable doesn't support rightIcon

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async () => {
    if (formState.isSubmitting) return;

    logger.info('🔐 Register attempt started', { 
      email: formState.email,
      username: formState.username 
    }, 'REGISTER_SCREEN');

    if (!validateForm()) {
      const errorMessages = Object.values(formState.errors).filter(Boolean);
      const firstError = errorMessages.length > 0 ? errorMessages[0] : 'Revisa los campos del formulario';
      showSnackbar(`Por favor corrige los errores: ${firstError}`, true);
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));

      const registerData: RegisterRequest = {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        username: formState.username.trim().toLowerCase(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        confirmPassword: formState.confirmPassword,
      };

      await mockAuthService.register(registerData);
      
      logger.info('✅ Registration successful', { 
        email: registerData.email,
        username: registerData.username 
      }, 'REGISTER_SCREEN');

      showSnackbar('¡Cuenta creada exitosamente! Redirigiendo al login...', false);

      // Navigate to login after successful registration
      setTimeout(() => {
        logger.info('🚀 Navigating to login after successful registration', { email: registerData.email }, 'REGISTER_SCREEN');
        navigation.navigate('Login', { 
          registeredEmail: registerData.email,
          justRegistered: true 
        });
      }, 2000);

    } catch (error: any) {
      handleJavaScriptError(error, { screen: 'RegisterScreen', action: 'register' });

      const userMessage = handleApiError(error);
      setFormState(prev => ({
        ...prev,
        errors: handleValidationErrors(error) || prev.errors,
      }));
      showSnackbar(userMessage.message, true);
      
      logger.error('💥 Registration error', error, 'REGISTER_SCREEN');
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.email, formState.username, formState.firstName, formState.lastName, formState.password, formState.confirmPassword, formState.isSubmitting, formState.errors, validateForm, showSnackbar, navigation]);

  /**
   * Navigates to login screen
   */
  const handleNavigateToLogin = useCallback(() => {
    logger.info('🔄 Navigate to login', undefined, 'REGISTER_SCREEN');
    try {
      navigation.navigate('Login');
    } catch (error) {
      logger.error('Failed to navigate to login screen', error, 'REGISTER_SCREEN');
      Alert.alert('Error', 'No se pudo navegar a la pantalla de inicio de sesión');
    }
  }, [navigation]);

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

          <InputTextReusable
            label="Nombre de Usuario"
            placeholder="Tu nombre de usuario único"
            value={formState.username}
            onChangeText={(value: string) => updateField('username', value)}
            autoCapitalize="none"
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.username}
            style={styles.input}
          />

          {/* Account Information */}
          <Text style={styles.sectionTitle}>Información de Cuenta</Text>
          
          <InputTextReusable
            label="Correo Electrónico"
            placeholder="tu@email.com"
            value={formState.email}
            onChangeText={(value: string) => updateField('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!formState.isSubmitting}
            errorMessage={formState.errors.email}
            style={styles.input}
          />

          <InputTextReusable
            label="Contraseña"
            placeholder="Crea una contraseña segura"
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
              onPress={() => updateField('acceptedTerms', !formState.acceptedTerms)}
              title="Acepto los términos y condiciones de uso"
              textStyle={styles.termsLabel}
              disabled={formState.isSubmitting}
            />
            {formState.errors.terms && (
              <Text style={styles.errorText}>{formState.errors.terms}</Text>
            )}
          </View>

          {/* Submit Button */}
          <ReusableButton
            titleButton={formState.isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            onPressActionButton={handleSubmit}
            buttonStyle={[styles.submitButton, computedStyles.submitButton]}
            textButtonStyle={styles.submitButtonText}
            disabled={formState.isSubmitting}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Metrics.large,
    marginBottom: Metrics.medium,
  },
  input: {
    marginBottom: Metrics.medium,
  },
  termsContainer: {
    marginVertical: Metrics.large,
    paddingHorizontal: Metrics.small,
  },
  termsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    color: Colors.feedback.error[300],
    marginTop: Metrics.small,
    paddingLeft: Metrics.large,
  },
  submitButton: {
    backgroundColor: Colors.primary[400],
    paddingVertical: Metrics.medium + 2,
    borderRadius: 12,
    marginTop: Metrics.medium,
    marginBottom: Metrics.large,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.medium,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginButton: {
    paddingVertical: Metrics.small,
    paddingHorizontal: 0,
  },
});

export default RegisterScreen;
