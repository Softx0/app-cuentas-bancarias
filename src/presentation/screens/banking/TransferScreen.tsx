/**
 * @fileoverview TransferScreen - Money transfer between accounts
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

import type { RootStackNavigationProp } from '../../../../types/navigation';

import ReusableButton from '../../../../components/custom-button/ReusableButton';
import DropDownListReusable from '../../../../components/custom-dropdown/DropDownListReusable';
import InputTextReusable from '../../../../components/custom-input/InputTextReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { handleApiError } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services
import { getAccountsByUserId } from '../../../infrastructure/services/mock/data/mockAccounts';
import { createTransaction } from '../../../infrastructure/services/mock/data/mockTransactions';
import type { BankAccount } from '../../../shared/types';

/**
 * Transfer form data interface
 */
interface TransferFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description: string;
  reference: string;
}

/**
 * Transfer validation interface
 */
interface TransferValidation {
  isValid: boolean;
  errors: {
    fromAccountId?: string;
    toAccountId?: string;
    amount?: string;
    description?: string;
    general?: string;
  };
}

/**
 * Transfer screen state interface
 */
interface TransferState {
  accounts: BankAccount[];
  formData: TransferFormData;
  validation: TransferValidation;
  loading: boolean;
  submitting: boolean;
  showConfirmation: boolean;
  error: string | null;
}

/**
 * TransferScreen Component
 * Handles money transfers between user accounts
 */
export const TransferScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'Transfer'>>();
  const route = useRoute();

  // Get navigation parameters
  const navigationParams = route.params as any;
  const prefilledFromAccountId = navigationParams?.fromAccountId;
  const prefilledFromAccountData = navigationParams?.fromAccountData;

  // Component state
  const [state, setState] = useState<TransferState>({
    accounts: [],
    formData: {
      fromAccountId: prefilledFromAccountId || '',
      toAccountId: '',
      amount: '',
      description: '',
      reference: '',
    },
    validation: {
      isValid: false,
      errors: {},
    },
    loading: true,
    submitting: false,
    showConfirmation: false,
    error: null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    isError: false,
  });


  // Mock user ID (in real app, this would come from auth context)
  const currentUserId = 'user_001';

  /**
   * Shows snackbar message
   */
  const showSnackbar = useCallback((message: string, isError: boolean = false) => {
    setSnackbar({ visible: true, message, isError });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  /**
   * Loads user accounts
   */
  const loadAccounts = useCallback(async () => {
    try {
      logger.info('🏦 Loading user accounts for transfer', undefined, 'TRANSFER_SCREEN');

      setState(prev => ({ ...prev, loading: true, error: null }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load user accounts
      const userAccounts = getAccountsByUserId(currentUserId);
      const activeAccounts = userAccounts.filter(account => account.isActive);

      setState(prev => ({
        ...prev,
        accounts: activeAccounts,
        loading: false,
        error: null,
      }));

      logger.info('✅ Accounts loaded for transfer', {
        totalAccounts: activeAccounts.length,
      }, 'TRANSFER_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'TransferScreen',
        action: 'loadAccounts'
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: userMessage.message,
      }));

      showSnackbar(userMessage.message, true);
      logger.error('❌ Failed to load accounts for transfer', error, 'TRANSFER_SCREEN');
    }
  }, [currentUserId, showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('💸 Transfer screen focused', undefined, 'TRANSFER_SCREEN');
      loadAccounts();
    }, [loadAccounts])
  );

  /**
   * Handle prefilled account data from navigation
   */
  useEffect(() => {
    if (prefilledFromAccountId && prefilledFromAccountData && state.accounts.length > 0) {
      logger.info('💸 Transfer screen with prefilled account', { 
        accountId: prefilledFromAccountId,
        accountType: prefilledFromAccountData.accountType,
        balance: prefilledFromAccountData.balance,
      }, 'TRANSFER_SCREEN');
      
      // Show helpful message to user
      showSnackbar(`Cuenta ${prefilledFromAccountData.accountType === 'savings' ? 'de Ahorros' : 'Corriente'} preseleccionada`, false);
    }
  }, [prefilledFromAccountId, prefilledFromAccountData, state.accounts.length, showSnackbar]);

  /**
   * Validates transfer form
   */
  const validateForm = useCallback((formData: TransferFormData): TransferValidation => {
    const errors: TransferValidation['errors'] = {};

    // From account validation
    if (!formData.fromAccountId) {
      errors.fromAccountId = 'Selecciona una cuenta de origen';
    }

    // To account validation
    if (!formData.toAccountId) {
      errors.toAccountId = 'Selecciona una cuenta de destino';
    } else if (formData.fromAccountId === formData.toAccountId) {
      errors.toAccountId = 'La cuenta de destino debe ser diferente a la de origen';
    }

    // Amount validation
    if (!formData.amount) {
      errors.amount = 'Ingresa el monto a transferir';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'El monto debe ser mayor que cero';
      } else if (amount > 2700000) {
        errors.amount = 'El monto máximo por transferencia es RD$2,700,000';
      } else if (formData.fromAccountId) {
        // Check sufficient balance
        const fromAccount = state.accounts.find(acc => acc.id === formData.fromAccountId);
        if (fromAccount && amount > fromAccount.balance) {
          errors.amount = 'Saldo insuficiente en la cuenta de origen';
        }
      }
    }

    // Description validation
    if (!formData.description.trim()) {
        errors.description = 'Ingrese una descripción para la transferencia';
    } else if (formData.description.length < 3) {
      errors.description = 'La descripción debe tener al menos 3 caracteres';
    } else if (formData.description.length > 100) {
      errors.description = 'La descripción no puede exceder 100 caracteres';
    }

    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
  }, [state.accounts]);

  /**
   * Updates form data and validates
   */
  const updateFormData = useCallback((field: keyof TransferFormData, value: string) => {
    setState(prev => {
      const newFormData = { ...prev.formData, [field]: value };
      
      // Auto-generate reference if amount or accounts change
      if (field === 'fromAccountId' || field === 'toAccountId' || field === 'amount') {
        newFormData.reference = `TRF-${Date.now()}`;
      }
      
      const validation = validateForm(newFormData);
      
      return {
        ...prev,
        formData: newFormData,
        validation,
      };
    });
  }, [validateForm]);

  /**
   * Shows transfer confirmation
   */
  const showTransferConfirmation = useCallback(() => {
    const fromAccount = state.accounts.find(acc => acc.id === state.formData.fromAccountId);
    const toAccount = state.accounts.find(acc => acc.id === state.formData.toAccountId);
    
    if (!fromAccount || !toAccount) return;

    const amount = parseFloat(state.formData.amount);
    
    Alert.alert(
      'Confirmar Transferencia',
      `¿Confirmas la transferencia de ${formatCurrency(amount)} desde ${getAccountDisplayName(fromAccount)} hacia ${getAccountDisplayName(toAccount)}?\n\nDescripción: ${state.formData.description}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: processTransfer, style: 'default' },
      ]
    );
  }, [state.accounts, state.formData]);

  /**
   * Processes the transfer
   */
  const processTransfer = useCallback(async () => {
    try {
      logger.info('💸 Processing transfer', {
        fromAccountId: state.formData.fromAccountId,
        toAccountId: state.formData.toAccountId,
        amount: state.formData.amount,
        description: state.formData.description,
      }, 'TRANSFER_SCREEN');

      setState(prev => ({ ...prev, submitting: true, error: null }));

      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const amount = parseFloat(state.formData.amount);
      const now = new Date();

      // Create debit transaction (from account)
      const debitTransaction = createTransaction({
        accountId: state.formData.fromAccountId,
        type: 'debit',
        amount,
        description: state.formData.description,
        category: 'transfer',
        date: now,
        status: 'completed',
        reference: state.formData.reference,
        toAccountId: state.formData.toAccountId,
      });

      // Create credit transaction (to account)
      const creditTransaction = createTransaction({
        accountId: state.formData.toAccountId,
        type: 'credit',
        amount,
        description: state.formData.description,
        category: 'transfer',
        date: now,
        status: 'completed',
        reference: state.formData.reference,
        toAccountId: state.formData.fromAccountId,
      });

      setState(prev => ({
        ...prev,
        submitting: false,
        formData: {
          fromAccountId: '',
          toAccountId: '',
          amount: '',
          description: '',
          reference: '',
        },
        validation: { isValid: false, errors: {} },
      }));

      showSnackbar('¡Transferencia realizada exitosamente!', false);

      // Navigate to transfer result screen
      logger.info('✅ Transfer completed successfully', {
        debitTransactionId: debitTransaction.id,
        creditTransactionId: creditTransaction.id,
        amount,
      }, 'TRANSFER_SCREEN');

      // Navigate to TransferResultScreen
      navigation.navigate('TransferResult', { 
        transactionId: debitTransaction.id,
        success: true 
      });

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'TransferScreen',
        action: 'executeTransfer'
      });
      
      setState(prev => ({
        ...prev,
        submitting: false,
        error: userMessage.message,
      }));

      showSnackbar(userMessage.message, true);
      logger.error('❌ Transfer failed', error, 'TRANSFER_SCREEN');
    }
  }, [state.formData, showSnackbar, navigation]);

  /**
   * Utility functions
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  const getAccountDisplayName = useCallback((account: BankAccount): string => {
    const type = account.accountType === 'savings' ? 'Ahorros' : 'Corriente';
    const lastFour = account.accountNumber.slice(-4);
    return `${type} *${lastFour}`;
  }, []);

  const getAccountBalance = useCallback((accountId: string): string => {
    const account = state.accounts.find(acc => acc.id === accountId);
    return account ? formatCurrency(account.balance) : '';
  }, [state.accounts, formatCurrency]);

  // Account options for dropdowns
  const accountOptions = useMemo(() => 
    state.accounts.map(account => ({
      label: `${getAccountDisplayName(account)} - ${formatCurrency(account.balance)}`,
      value: account.id,
    }))
  , [state.accounts, getAccountDisplayName, formatCurrency]);

  const toAccountOptions = useMemo(() => 
    state.accounts
      .filter(account => account.id !== state.formData.fromAccountId)
      .map(account => ({
        label: `${getAccountDisplayName(account)} - ${formatCurrency(account.balance)}`,
        value: account.id,
      }))
  , [state.accounts, state.formData.fromAccountId, getAccountDisplayName, formatCurrency]);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transferir Dinero</Text>
        </View>
        <View style={styles.loadingContainer}>
          <CustomLoading size="large" color={Colors.primary[400]} />
          <Text style={styles.loadingText}>Cargando cuentas disponibles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error && state.accounts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transferir Dinero</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error al cargar cuentas</Text>
          <Text style={styles.errorMessage}>{state.error}</Text>
          <ReusableButton
            titleButton="Reintentar"
            onPressActionButton={loadAccounts}
            buttonStyle={styles.retryButton}
            textButtonStyle={styles.retryButtonText}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transferencia de Fondos</Text>
          <Text style={styles.headerSubtitle}>
            Transfiera fondos entre sus cuentas de forma segura
          </Text>
        </View>

        {/* Transfer Form */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* From Account */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Cuenta de Origen</Text>
            <DropDownListReusable
              label="Seleccionar cuenta de origen"
              data={accountOptions}
              valueSelected={state.formData.fromAccountId}
              onChange={(value: string) => updateFormData('fromAccountId', value)}
              errorMessage={state.validation.errors.fromAccountId}
              customStyles={{
                container: styles.dropdown,
              }}
            />
            {state.formData.fromAccountId && (
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Saldo disponible:</Text>
                <Text style={styles.balanceAmount}>
                  {getAccountBalance(state.formData.fromAccountId)}
                </Text>
              </View>
            )}
          </View>

          {/* To Account */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Cuenta de Destino</Text>
            <DropDownListReusable
              label="Seleccionar cuenta de destino"
              data={toAccountOptions}
              valueSelected={state.formData.toAccountId}
              onChange={(value: string) => updateFormData('toAccountId', value)}
              errorMessage={state.validation.errors.toAccountId}
              customStyles={{
                container: styles.dropdown,
              }}
              disabled={!state.formData.fromAccountId}
            />
          </View>

          {/* Amount */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Monto a Transferir</Text>
            <InputTextReusable
              label="Monto"
              value={state.formData.amount}
              onChangeText={(value: string) => updateFormData('amount', value)}
              placeholder="0.00"
              keyboardType="numeric"
              errorMessage={state.validation.errors.amount}
              style={styles.input}
            />
            <Text style={styles.limitInfo}>
              Límite máximo: RD$2,700,000 por transferencia
            </Text>
          </View>

          {/* Description */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <InputTextReusable
              label="Descripción de la transferencia"
              value={state.formData.description}
              onChangeText={(value: string) => updateFormData('description', value)}
              placeholder="Ej: Pago de gastos, ahorro mensual..."
              maxLength={100}
              errorMessage={state.validation.errors.description}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.characterCount}>
              {state.formData.description.length}/100 caracteres
            </Text>
          </View>

          {/* Reference (auto-generated) */}
          {state.formData.reference && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Referencia</Text>
              <View style={styles.referenceContainer}>
                <Text style={styles.referenceText}>{state.formData.reference}</Text>
              </View>
            </View>
          )}

          {/* Transfer Summary */}
          {state.validation.isValid && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Resumen de Transferencia</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Origen:</Text>
                <Text style={styles.summaryValue}>
                  {getAccountDisplayName(state.accounts.find(acc => acc.id === state.formData.fromAccountId)!)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Destino:</Text>
                <Text style={styles.summaryValue}>
                  {getAccountDisplayName(state.accounts.find(acc => acc.id === state.formData.toAccountId)!)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Monto:</Text>
                <Text style={[styles.summaryValue, styles.summaryAmount]}>
                  {formatCurrency(parseFloat(state.formData.amount))}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Descripción:</Text>
                <Text style={styles.summaryValue}>{state.formData.description}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <ReusableButton
            titleButton={state.submitting ? "Procesando..." : "Ejecutar Transferencia"}
            onPressActionButton={showTransferConfirmation}
            disabled={!state.validation.isValid || state.submitting}
            loading={state.submitting}
            buttonStyle={[
              styles.transferButton,
              (!state.validation.isValid || state.submitting) && styles.transferButtonDisabled
            ]}
            textButtonStyle={styles.transferButtonText}
          />
        </View>

        {/* Snackbar */}
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          backgroundColorSnack={snackbar.isError ? Colors.feedback.error[100] : Colors.feedback.success[100]}
          duration={3000}
          messageTextStyle={{
            color: snackbar.isError ? Colors.feedback.error[300] : Colors.feedback.success[300]
          }}
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
  header: {
    paddingHorizontal: Metrics.large,
    paddingVertical: Metrics.large,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Metrics.large,
    paddingBottom: Metrics.xxLarge,
  },
  formSection: {
    marginBottom: Metrics.xLarge,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
  },
  dropdown: {
    marginBottom: Metrics.small,
  },
  input: {
    marginBottom: Metrics.small,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    padding: Metrics.medium,
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.primary[400],
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 16,
    color: Colors.primary[400],
    fontWeight: 'bold',
  },
  limitInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  referenceContainer: {
    backgroundColor: Colors.neutral[200],
    padding: Metrics.medium,
    borderRadius: 8,
  },
  referenceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    padding: Metrics.large,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Metrics.medium,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary[400],
  },
  buttonContainer: {
    padding: Metrics.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  transferButton: {
    backgroundColor: Colors.primary[400],
    paddingVertical: Metrics.large,
    borderRadius: 12,
    alignItems: 'center',
  },
  transferButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  transferButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.xLarge,
  },
  loadingText: {
    marginTop: Metrics.large,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.xLarge,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Metrics.large,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Metrics.xLarge,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.primary[400],
    paddingHorizontal: Metrics.xLarge,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TransferScreen;
