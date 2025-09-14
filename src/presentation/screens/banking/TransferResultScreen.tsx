/**
 * @fileoverview TransferResultScreen - Display transfer operation results
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackNavigationProp } from '../../../../types/navigation';

import ReusableButton from '../../../../components/custom-button/ReusableButton';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { handleApiError } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services
import { getAccountById } from '../../../infrastructure/services/mock/data/mockAccounts';
import { getTransactionById } from '../../../infrastructure/services/mock/data/mockTransactions';
import type { BankAccount, Transaction } from '../../../shared/types';

/**
 * Transfer result state interface
 */
interface TransferResultState {
  transaction: Transaction | null;
  fromAccount: BankAccount | null;
  toAccount: BankAccount | null;
  loading: boolean;
  error: string | null;
}

/**
 * Transfer result props interface
 */
interface TransferResultProps {
  transactionId?: string; // In real app, this would come from navigation params
}

/**
 * TransferResultScreen Component
 * Displays the result of a transfer operation with detailed information
 */
export const TransferResultScreen: React.FC<TransferResultProps> = ({ 
  transactionId = 'txn_004' // Mock transaction ID for demo
}) => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'TransferResult'>>();

  // Component state
  const [state, setState] = useState<TransferResultState>({
    transaction: null,
    fromAccount: null,
    toAccount: null,
    loading: true,
    error: null,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    isError: false,
  });


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
   * Loads transfer details
   */
  const loadTransferDetails = useCallback(async () => {
    try {
      logger.info('📄 Loading transfer result details', { transactionId }, 'TRANSFER_RESULT_SCREEN');

      setState(prev => ({ ...prev, loading: true, error: null }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load transaction details
      const transaction = getTransactionById(transactionId);
      if (!transaction) {
        throw new Error('Transacción no encontrada');
      }

      // Load account details
      const fromAccount = getAccountById(transaction.accountId);
      const toAccount = transaction.toAccountId ? getAccountById(transaction.toAccountId) : null;

      setState(prev => ({
        ...prev,
        transaction,
        fromAccount: fromAccount || null,
        toAccount: toAccount || null,
        loading: false,
        error: null,
      }));

      logger.info('✅ Transfer result details loaded', {
        transactionId: transaction.id,
        fromAccountId: fromAccount?.id,
        toAccountId: toAccount?.id,
        amount: transaction.amount,
        status: transaction.status,
      }, 'TRANSFER_RESULT_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'TransferResultScreen',
        action: 'loadTransferDetails'
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: userMessage.message,
      }));

      showSnackbar(userMessage.message, true);
      logger.error('❌ Failed to load transfer result details', error, 'TRANSFER_RESULT_SCREEN');
    }
  }, [transactionId, showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('📄 Transfer result screen focused', { transactionId }, 'TRANSFER_RESULT_SCREEN');
      loadTransferDetails();
    }, [loadTransferDetails, transactionId])
  );

  /**
   * Navigation handlers
   */
  const handleBackToHome = useCallback(() => {
    logger.info('🏠 Navigate back to home', undefined, 'TRANSFER_RESULT_SCREEN');
    
    try {
      // Option 1: Reset navigation to TabMenu with Home tab
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'TabMenu' as any,
            state: {
              routes: [{ name: 'Home' }],
              index: 0,
            },
          },
        ],
      });
      
      showSnackbar('Regresando al inicio', false);
    } catch (error) {
      // Fallback option: Simple navigation to TabMenu
      logger.warn('Reset failed, using fallback navigation', error, 'TRANSFER_RESULT_SCREEN');
      
      navigation.popToTop();
      navigation.navigate('TabMenu' as any);
      showSnackbar('Regresando al inicio', false);
    }
  }, [navigation, showSnackbar]);

  const handleNewTransfer = useCallback(() => {
    logger.info('💸 Navigate to new transfer', undefined, 'TRANSFER_RESULT_SCREEN');
    
    // Navigate to Transfer screen
    navigation.navigate('Transfer' as any);
    showSnackbar('Abriendo nueva transferencia', false);
  }, [navigation, showSnackbar]);

  const handleViewTransactionHistory = useCallback(() => {
    logger.info('📊 Navigate to transaction history', undefined, 'TRANSFER_RESULT_SCREEN');
    
    // Navigate to Transaction History screen
    navigation.navigate('TransactionHistory' as any);
    showSnackbar('Abriendo historial de transacciones', false);
  }, [navigation, showSnackbar]);

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

  const formatTransactionDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('es-DO', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  const getAccountDisplayName = useCallback((account: BankAccount): string => {
    const type = account.accountType === 'savings' ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
    const lastFour = account.accountNumber.slice(-4);
    return `${type} *${lastFour}`;
  }, []);

  const getStatusText = useCallback((status: 'completed' | 'pending' | 'failed'): string => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallida';
      default: return 'Desconocido';
    }
  }, []);

  /**
   * Share transfer receipt
   */
  const shareTransferReceipt = useCallback(async () => {
    if (!state.transaction || !state.fromAccount || !state.toAccount) return;

    try {
      const receipt = `
🏦 COMPROBANTE DE TRANSFERENCIA

📄 Referencia: ${state.transaction.reference}
💰 Monto: ${formatCurrency(state.transaction.amount)}
📅 Fecha: ${formatTransactionDate(state.transaction.date)}

👤 Cuenta Origen:
${getAccountDisplayName(state.fromAccount)}

👤 Cuenta Destino:
${getAccountDisplayName(state.toAccount)}

📝 Descripción: ${state.transaction.description}
✅ Estado: ${getStatusText(state.transaction.status)}

Transferencia completada exitosamente.
      `.trim();

      await Share.share({
        message: receipt,
        title: 'Comprobante de Transferencia',
      });

      logger.info('📤 Transfer receipt shared', { transactionId: state.transaction.id }, 'TRANSFER_RESULT_SCREEN');
      showSnackbar('Comprobante compartido', false);

    } catch (error) {
      logger.error('❌ Failed to share receipt', error, 'TRANSFER_RESULT_SCREEN');
      showSnackbar('Error al compartir comprobante', true);
    }
  }, [state.transaction, state.fromAccount, state.toAccount, showSnackbar, formatCurrency, formatTransactionDate, getAccountDisplayName, getStatusText]);

  const getStatusIcon = useCallback((status: 'completed' | 'pending' | 'failed'): string => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  }, []);

  const getStatusColor = useCallback((status: 'completed' | 'pending' | 'failed'): string => {
    switch (status) {
      case 'completed': return Colors.feedback.success[300];
      case 'pending': return Colors.feedback.info[300];
      case 'failed': return Colors.feedback.error[300];
      default: return Colors.textSecondary;
    }
  }, []);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>⏳</Text>
          <Text style={styles.loadingTitle}>Cargando Resultado</Text>
          <Text style={styles.loadingText}>Obteniendo detalles de la transferencia...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error || !state.transaction || !state.fromAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error al cargar resultado</Text>
          <Text style={styles.errorMessage}>
            {state.error || 'No se pudo encontrar la información de la transferencia'}
          </Text>
          <ReusableButton
            titleButton="Reintentar"
            onPressActionButton={loadTransferDetails}
            buttonStyle={styles.retryButton}
            textButtonStyle={styles.retryButtonText}
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
            <Text style={styles.backButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { transaction, fromAccount, toAccount } = state;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Header */}
        <View style={[
          styles.statusHeader,
          { backgroundColor: transaction.status === 'completed' ? Colors.feedback.success[100] : 
                             transaction.status === 'pending' ? Colors.feedback.info[100] : 
                             Colors.feedback.error[100] }
        ]}>
          <Text style={styles.statusIcon}>
            {getStatusIcon(transaction.status)}
          </Text>
          <Text style={styles.statusTitle}>
            {transaction.status === 'completed' ? 'Transferencia Exitosa' :
             transaction.status === 'pending' ? 'Transferencia Pendiente' :
             'Transferencia Fallida'}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
            {getStatusText(transaction.status)}
          </Text>
        </View>

        {/* Transfer Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Detalles de la Transferencia</Text>
          
          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Monto Transferido</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(transaction.amount)}
            </Text>
          </View>

          {/* Transaction Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Referencia:</Text>
              <Text style={styles.infoValue}>{transaction.reference}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha y Hora:</Text>
              <Text style={styles.infoValue}>
                {formatTransactionDate(transaction.date)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Descripción:</Text>
              <Text style={styles.infoValue}>{transaction.description}</Text>
            </View>
          </View>
        </View>

        {/* Account Details */}
        <View style={styles.accountsCard}>
          <Text style={styles.cardTitle}>Cuentas Involucradas</Text>
          
          {/* From Account */}
          <View style={styles.accountSection}>
            <Text style={styles.accountLabel}>💸 Cuenta de Origen</Text>
            <Text style={styles.accountName}>
              {getAccountDisplayName(fromAccount)}
            </Text>
            <Text style={styles.accountBalance}>
              Saldo actual: {formatCurrency(fromAccount.balance)}
            </Text>
          </View>

          {/* To Account */}
          {toAccount && (
            <View style={styles.accountSection}>
              <Text style={styles.accountLabel}>💰 Cuenta de Destino</Text>
              <Text style={styles.accountName}>
                {getAccountDisplayName(toAccount)}
              </Text>
              <Text style={styles.accountBalance}>
                Saldo actual: {formatCurrency(toAccount.balance)}
              </Text>
            </View>
          )}
        </View>

        {/* Success Message */}
        {transaction.status === 'completed' && (
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Operación Completada</Text>
            <Text style={styles.successMessage}>
              Su transferencia ha sido procesada exitosamente. Los fondos están disponibles en la cuenta de destino.
            </Text>
          </View>
        )}

        {/* Warning Message for Pending */}
        {transaction.status === 'pending' && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⏳</Text>
            <Text style={styles.warningTitle}>Procesando Transferencia</Text>
            <Text style={styles.warningMessage}>
              Su transferencia está siendo procesada. Los fondos estarán disponibles en la cuenta de destino en unos minutos.
            </Text>
          </View>
        )}

        {/* Error Message for Failed */}
        {transaction.status === 'failed' && (
          <View style={styles.failedCard}>
            <Text style={styles.failedIcon}>❌</Text>
            <Text style={styles.failedTitle}>Transferencia Fallida</Text>
            <Text style={styles.failedMessage}>
              No se pudo completar la transferencia. Los fondos no fueron debitados de su cuenta. Favor intentar nuevamente.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {transaction.status === 'completed' && (
          <ReusableButton
            titleButton="Compartir Comprobante"
            onPressActionButton={shareTransferReceipt}
            buttonStyle={styles.shareButton}
            textButtonStyle={styles.shareButtonText}
          />
        )}
        
        <View style={styles.buttonRow}>
          <ReusableButton
            titleButton="Nueva Transferencia"
            onPressActionButton={handleNewTransfer}
            buttonStyle={[styles.actionButton, styles.transferButton]}
            textButtonStyle={styles.transferButtonText}
          />
          
          <ReusableButton
            titleButton="Consultar Historial"
            onPressActionButton={handleViewTransactionHistory}
            buttonStyle={[styles.actionButton, styles.historyButton]}
            textButtonStyle={styles.historyButtonText}
          />
        </View>
        
        <ReusableButton
          titleButton="Regresar al Inicio"
          onPressActionButton={handleBackToHome}
          buttonStyle={styles.homeButton}
          textButtonStyle={styles.homeButtonText}
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
    </SafeAreaView>
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
    padding: Metrics.large,
    paddingBottom: Metrics.xxLarge,
  },
  statusHeader: {
    alignItems: 'center',
    padding: Metrics.xLarge,
    borderRadius: 16,
    marginBottom: Metrics.large,
  },
  statusIcon: {
    fontSize: 48,
    marginBottom: Metrics.medium,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Metrics.large,
    marginBottom: Metrics.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
  },
  amountContainer: {
    alignItems: 'center',
    padding: Metrics.large,
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
    marginBottom: Metrics.large,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.primary[400],
    marginBottom: Metrics.small,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary[400],
  },
  infoGrid: {
    gap: Metrics.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  accountsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Metrics.large,
    marginBottom: Metrics.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountSection: {
    marginBottom: Metrics.large,
    paddingBottom: Metrics.large,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  accountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Metrics.small,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  accountBalance: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  successCard: {
    backgroundColor: Colors.feedback.success[100],
    borderRadius: 16,
    padding: Metrics.large,
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  successIcon: {
    fontSize: 32,
    marginBottom: Metrics.medium,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.feedback.success[300],
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: Colors.feedback.success[300],
    textAlign: 'center',
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: Colors.feedback.info[100],
    borderRadius: 16,
    padding: Metrics.large,
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  warningIcon: {
    fontSize: 32,
    marginBottom: Metrics.medium,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.feedback.info[300],
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  warningMessage: {
    fontSize: 14,
    color: Colors.feedback.info[300],
    textAlign: 'center',
    lineHeight: 20,
  },
  failedCard: {
    backgroundColor: Colors.feedback.error[100],
    borderRadius: 16,
    padding: Metrics.large,
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  failedIcon: {
    fontSize: 32,
    marginBottom: Metrics.medium,
  },
  failedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.feedback.error[300],
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  failedMessage: {
    fontSize: 14,
    color: Colors.feedback.error[300],
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButtons: {
    padding: Metrics.large,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  shareButton: {
    backgroundColor: Colors.secondary[400],
    paddingVertical: Metrics.medium,
    borderRadius: 12,
    marginBottom: Metrics.medium,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 16,
    paddingVertical: Metrics.medium,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Metrics.medium,
    marginVertical: Metrics.xxLarge,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Metrics.medium,
    paddingHorizontal: Metrics.small,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferButton: {
    backgroundColor: Colors.primary[400],
  },
  transferButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  historyButton: {
    backgroundColor: Colors.neutral[300],
  },
  historyButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: Colors.neutral[200],
    paddingVertical: Metrics.medium,
    borderRadius: 12,
  },
  homeButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    paddingVertical: Metrics.medium,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.xLarge,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: Metrics.large,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    marginBottom: Metrics.medium,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: Colors.neutral[200],
    paddingHorizontal: Metrics.xLarge,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TransferResultScreen;
