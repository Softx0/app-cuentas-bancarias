import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
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
import type { RootStackParamList } from '../../../../types/navigation';
import { useAuth } from '../../../context/auth/AuthContext';
import { logger } from '../../../infrastructure/utils/logger';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type Step = 'form' | 'confirm';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  code?: string;
}

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, confirmRegistration } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({ visible: false, message: '', isError: false });

  const showSnackbar = useCallback((message: string, isError = false) => {
    setSnackbar({ visible: true, message, isError });
    setTimeout(() => setSnackbar(prev => ({ ...prev, visible: false })), 4000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      logger.info('Register screen focused', undefined, 'REGISTER_SCREEN');
    }, [])
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword]);

  const handleRegister = useCallback(async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await register(email.trim().toLowerCase(), password);
      setStep('confirm');
      showSnackbar('Código enviado a tu correo', false);
    } catch (error: any) {
      showSnackbar(error.message, true);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateForm, register, email, password, showSnackbar]);

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) return;

    if (!code.trim()) {
      setErrors({ code: 'Ingresa el código de verificación' });
      return;
    }

    try {
      setIsSubmitting(true);
      await confirmRegistration(email.trim().toLowerCase(), code.trim());
      showSnackbar('¡Cuenta confirmada! Ahora inicia sesión.', false);
      setTimeout(() => {
        navigation.navigate('Login', { registeredEmail: email.trim().toLowerCase(), justRegistered: true });
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.message, true);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, confirmRegistration, email, code, showSnackbar, navigation]);

  const computedOpacity = useMemo(() => ({ opacity: isSubmitting ? 0.6 : 1 }), [isSubmitting]);

  // ── Confirmation step ──────────────────────────────────────────────────────
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>Verificar Cuenta</Text>
              <Text style={styles.subtitle}>
                Enviamos un código a{'\n'}{email}
              </Text>
            </View>

            <View style={styles.form}>
              <InputTextReusable
                label="Código de Verificación"
                placeholder="123456"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                editable={!isSubmitting}
                errorMessage={errors.code}
                style={styles.input}
              />

              <ReusableButton
                titleButton={isSubmitting ? 'Verificando...' : 'Confirmar Cuenta'}
                onPressActionButton={handleConfirm}
                buttonStyle={[styles.submitButton, computedOpacity, { backgroundColor: Colors.primary[400] }]}
                textButtonStyle={{ color: Colors.white }}
                disabled={isSubmitting}
                loading={isSubmitting}
              />

              <ReusableButton
                titleButton="Volver al registro"
                onPressActionButton={() => setStep('form')}
                buttonStyle={[styles.linkButton, { backgroundColor: 'transparent' }]}
                textButtonStyle={{ color: Colors.primary[400] }}
                disabled={isSubmitting}
              />
            </View>
          </ScrollView>

          {isSubmitting && <CustomLoading size="large" color={Colors.primary[400]} />}

          <Snackbar
            visible={snackbar.visible}
            message={snackbar.message}
            backgroundColorSnack={snackbar.isError ? Colors.feedback.error[100] : Colors.feedback.success[100]}
            messageTextStyle={{ color: snackbar.isError ? Colors.feedback.error[300] : Colors.feedback.success[300] }}
            duration={4000}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Regístrate con tu correo electrónico</Text>
          </View>

          <View style={styles.form}>
            <InputTextReusable
              label="Correo Electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={v => { setEmail(v); setErrors(prev => ({ ...prev, email: undefined })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              errorMessage={errors.email}
              style={styles.input}
            />

            <InputTextReusable
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={v => { setPassword(v); setErrors(prev => ({ ...prev, password: undefined })); }}
              secureTextEntry
              editable={!isSubmitting}
              errorMessage={errors.password}
              style={styles.input}
            />

            <InputTextReusable
              label="Confirmar Contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={v => { setConfirmPassword(v); setErrors(prev => ({ ...prev, confirmPassword: undefined })); }}
              secureTextEntry
              editable={!isSubmitting}
              errorMessage={errors.confirmPassword}
              style={styles.input}
            />

            <ReusableButton
              titleButton={isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              onPressActionButton={handleRegister}
              buttonStyle={[styles.submitButton, computedOpacity, { backgroundColor: Colors.primary[400] }]}
              textButtonStyle={{ color: Colors.white }}
              disabled={isSubmitting}
              loading={isSubmitting}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
              <ReusableButton
                titleButton="Inicia sesión aquí"
                onPressActionButton={() => navigation.navigate('Login')}
                buttonStyle={[styles.linkButton, { backgroundColor: 'transparent' }]}
                textButtonStyle={{ color: Colors.primary[400] }}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>

        {isSubmitting && <CustomLoading size="large" color={Colors.primary[400]} />}

        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          backgroundColorSnack={snackbar.isError ? Colors.feedback.error[100] : Colors.feedback.success[100]}
          messageTextStyle={{ color: snackbar.isError ? Colors.feedback.error[300] : Colors.feedback.success[300] }}
          duration={4000}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardContainer: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Metrics.large,
    paddingVertical: Metrics.xLarge,
  },
  header: { marginBottom: Metrics.xLarge, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Metrics.small, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  form: { flex: 1 },
  input: { marginBottom: Metrics.medium },
  submitButton: { marginBottom: Metrics.large, paddingVertical: Metrics.medium },
  loginContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 16, color: Colors.textSecondary },
  linkButton: { paddingVertical: Metrics.small, paddingHorizontal: 0 },
});

export default RegisterScreen;
