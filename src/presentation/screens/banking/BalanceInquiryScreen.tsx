/**
 * @fileoverview BalanceInquiryScreen - Account balance inquiry and details
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackNavigationProp } from '../../../../types/navigation';

import ReusableButton from '../../../../components/custom-button/ReusableButton';
import DropDownListReusable from '../../../../components/custom-dropdown/DropDownListReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { handleApiError } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services
// TODO: Reemplazar infraestructure por useBanking del Context para cumplir con Clean Architecture
import { getAccountById, getAccountsByUserId } from '../../../infrastructure/services/mock/data/mockAccounts';
import { getTransactionStats } from '../../../infrastructure/services/mock/data/mockTransactions';
import type { BankAccount } from '../../../shared/types';

/**
 * Balance inquiry state interface
 */
interface BalanceInquiryState {
  accounts: BankAccount[];
  selectedAccountId: string;
  selectedAccount: BankAccount | null;
  accountStats: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    averageTransactionAmount: number;
  } | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

/**
 * BalanceInquiryScreen Component
 * Displays detailed account balance information and statistics
 */
export const BalanceInquiryScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'BalanceInquiry'>>();

  // Component state
  const [state, setState] = useState<BalanceInquiryState>({
    accounts: [],
    selectedAccountId: '',
    selectedAccount: null,
    accountStats: null,
    loading: true,
    refreshing: false,
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
      logger.info('🏦 Loading user accounts for balance inquiry', undefined, 'BALANCE_INQUIRY_SCREEN');

      setState(prev => ({ ...prev, loading: true, error: null }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load user accounts
      const userAccounts = getAccountsByUserId(currentUserId);
      const activeAccounts = userAccounts.filter(account => account.isActive);

      // Select first account by default
      const defaultAccountId = activeAccounts.length > 0 ? activeAccounts[0].id : '';
      
      setState(prev => ({
        ...prev,
        accounts: activeAccounts,
        selectedAccountId: defaultAccountId,
        loading: false,
        error: null,
      }));

      // Load details for default account
      if (defaultAccountId) {
        loadAccountDetails(defaultAccountId, false);
      }

      logger.info('✅ Accounts loaded for balance inquiry', {
        totalAccounts: activeAccounts.length,
        defaultAccountId,
      }, 'BALANCE_INQUIRY_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'BalanceInquiryScreen',
        action: 'loadAccounts'
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: userMessage.message,
      }));

      showSnackbar(userMessage.message, true);
      logger.error('❌ Failed to load accounts for balance inquiry', error, 'BALANCE_INQUIRY_SCREEN');
    }
  }, [currentUserId, showSnackbar]);

  /**
   * Loads details for selected account
   */
  const loadAccountDetails = useCallback(async (accountId: string, isRefreshing: boolean = false) => {
    try {
      logger.info('📊 Loading account details', { accountId, isRefreshing }, 'BALANCE_INQUIRY_SCREEN');

      if (isRefreshing) {
        setState(prev => ({ ...prev, refreshing: true }));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Load account details
      const account = getAccountById(accountId);
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      // Load account statistics (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const stats = getTransactionStats(accountId, thirtyDaysAgo);

      setState(prev => ({
        ...prev,
        selectedAccount: account,
        accountStats: stats,
        refreshing: false,
        error: null,
      }));

      logger.info('✅ Account details loaded', {
        accountId: account.id,
        balance: account.balance,
        transactionCount: stats.totalTransactions,
      }, 'BALANCE_INQUIRY_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'BalanceInquiryScreen',
        action: 'loadAccountDetails'
      });
      
      setState(prev => ({
        ...prev,
        refreshing: false,
        error: userMessage.message,
      }));

      if (!isRefreshing) {
        showSnackbar(userMessage.message, true);
      }

      logger.error('❌ Failed to load account details', error, 'BALANCE_INQUIRY_SCREEN');
    }
  }, [showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('💰 Balance inquiry screen focused', undefined, 'BALANCE_INQUIRY_SCREEN');
      loadAccounts();
    }, [loadAccounts])
  );

  /**
   * Handles account selection change
   */
  const handleAccountChange = useCallback((accountId: string) => {
    setState(prev => ({ ...prev, selectedAccountId: accountId }));
    loadAccountDetails(accountId);
  }, [loadAccountDetails]);

  /**
   * Pull to refresh handler
   */
  const handleRefresh = useCallback(() => {
    if (state.selectedAccountId) {
      loadAccountDetails(state.selectedAccountId, true);
    }
  }, [loadAccountDetails, state.selectedAccountId]);

  /**
   * Share balance information
   */
  const shareBalanceInfo = useCallback(async () => {
    if (!state.selectedAccount) return;

    try {
      const balanceInfo = `
💰 CONSULTA DE SALDO

🏦 ${getAccountTypeText(state.selectedAccount.accountType)}
📄 Número: ${formatAccountNumber(state.selectedAccount.accountNumber)}
💵 Saldo Disponible: ${formatCurrency(state.selectedAccount.balance)}
💱 Moneda: ${state.selectedAccount.currency}

📅 Última Actualización: ${formatLastUpdateDate(state.selectedAccount.lastTransactionDate)}

Estado: ${state.selectedAccount.isActive ? 'Activa' : 'Inactiva'}
      `.trim();

      await Share.share({
        message: balanceInfo,
        title: 'Consulta de Saldo',
      });

      logger.info('📤 Balance info shared', { accountId: state.selectedAccount.id }, 'BALANCE_INQUIRY_SCREEN');
      showSnackbar('Información compartida', false);

    } catch (error) {
      logger.error('❌ Failed to share balance info', error, 'BALANCE_INQUIRY_SCREEN');
      showSnackbar('Error al compartir información', true);
    }
  }, [state.selectedAccount, showSnackbar]);

  /**
   * Navigation handlers
   */
  const handleTransferMoney = useCallback(() => {
    if (!state.selectedAccount) {
      showSnackbar('Por favor selecciona una cuenta', true);
      return;
    }

    logger.info('💸 Navigate to transfer from balance inquiry', { 
      accountId: state.selectedAccountId,
      accountBalance: state.selectedAccount.balance
    }, 'BALANCE_INQUIRY_SCREEN');
    
    // Navigate to TransferScreen with the selected account pre-filled
    navigation.navigate('Transfer' as any, {
      fromAccountId: state.selectedAccountId,
      fromAccountData: state.selectedAccount,
    });
  }, [state.selectedAccountId, state.selectedAccount, navigation, showSnackbar]);

  const handleViewTransactions = useCallback(() => {
    if (!state.selectedAccount) {
      showSnackbar('Por favor selecciona una cuenta', true);
      return;
    }

    logger.info('📊 Navigate to transactions from balance inquiry', { 
      accountId: state.selectedAccountId,
      accountType: state.selectedAccount.accountType
    }, 'BALANCE_INQUIRY_SCREEN');
    
    // Navigate to TransactionHistoryScreen with account context
    navigation.navigate('TransactionHistory' as any, {
      accountId: state.selectedAccountId,
      accountData: state.selectedAccount,
    });
  }, [state.selectedAccountId, state.selectedAccount, navigation, showSnackbar]);

  const handleAccountDetail = useCallback(() => {
    logger.info('📋 Navigate to account detail from balance inquiry', { accountId: state.selectedAccountId }, 'BALANCE_INQUIRY_SCREEN');
    Alert.alert(
      'Detalle de Cuenta',
      'Navegación a detalle de cuenta no implementada aún',
      [{ text: 'Entendido' }]
    );
  }, [state.selectedAccountId]);

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

  const formatAccountNumber = useCallback((accountNumber: string): string => {
    if (accountNumber.length < 4) return accountNumber;
    const firstFour = accountNumber.slice(0, 4);
    const lastFour = accountNumber.slice(-4);
    const middle = '*'.repeat(accountNumber.length - 8);
    return `${firstFour}${middle}${lastFour}`;
  }, []);

  const getAccountTypeText = useCallback((type: 'savings' | 'checking'): string => {
    return type === 'savings' ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
  }, []);

  const formatLastUpdateDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Account options for dropdown
  const accountOptions = useMemo(() => 
    state.accounts.map(account => ({
      label: `${getAccountTypeText(account.accountType)} *${account.accountNumber.slice(-4)}`,
      value: account.id,
    }))
  , [state.accounts, getAccountTypeText]);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consulta de Saldo</Text>
        </View>
        <View style={styles.loadingContainer}>
          <CustomLoading size="large" color={Colors.primary[400]} />
          <Text style={styles.loadingText}>Cargando información de cuentas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error && state.accounts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consulta de Saldo</Text>
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

  const { selectedAccount, accountStats } = state;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consulta de Saldo</Text>
        <Text style={styles.headerSubtitle}>
          Información detallada de sus cuentas bancarias
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[400]]}
            tintColor={Colors.primary[400]}
          />
        }
      >
        {/* Account Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionTitle}>Seleccionar Cuenta</Text>
          <DropDownListReusable
            label="Cuenta a consultar"
            data={accountOptions}
            valueSelected={state.selectedAccountId}
            onChange={handleAccountChange}
            customStyles={{
              container: styles.dropdown,
            }}
          />
        </View>

        {selectedAccount && (
          <>
            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.accountType}>
                  {getAccountTypeText(selectedAccount.accountType)}
                </Text>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: selectedAccount.isActive ? Colors.feedback.success[300] : Colors.feedback.error[300] }
                ]} />
              </View>
              
              <Text style={styles.accountNumber}>
                {formatAccountNumber(selectedAccount.accountNumber)}
              </Text>
              
              <View style={styles.balanceDisplay}>
                <Text style={styles.balanceLabel}>Saldo Disponible</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(selectedAccount.balance)}
                </Text>
                <Text style={styles.currency}>{selectedAccount.currency}</Text>
              </View>
              
              <Text style={styles.lastUpdate}>
                Última actualización: {formatLastUpdateDate(selectedAccount.lastTransactionDate)}
              </Text>
            </View>

            {/* Account Statistics */}
            {accountStats && (
              <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Estadísticas (Últimos 30 días)</Text>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{accountStats.totalTransactions}</Text>
                    <Text style={styles.statLabel}>Transacciones</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, styles.creditValue]}>
                      {formatCurrency(accountStats.totalCredits)}
                    </Text>
                    <Text style={styles.statLabel}>Ingresos</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, styles.debitValue]}>
                      {formatCurrency(accountStats.totalDebits)}
                    </Text>
                    <Text style={styles.statLabel}>Gastos</Text>
                  </View>
                </View>

                <View style={styles.averageSection}>
                  <Text style={styles.averageLabel}>Promedio por transacción:</Text>
                  <Text style={styles.averageValue}>
                    {formatCurrency(accountStats.averageTransactionAmount)}
                  </Text>
                </View>
              </View>
            )}

            {/* Quick Actions */}
            <View style={styles.actionsCard}>
              <Text style={styles.cardTitle}>Acciones Rápidas</Text>
              
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionButton} onPress={handleTransferMoney}>
                  <Text style={styles.actionIcon}>💸</Text>
                  <Text style={styles.actionText}>Transferir</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleViewTransactions}>
                  <Text style={styles.actionIcon}>📊</Text>
                  <Text style={styles.actionText}>Historial</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleAccountDetail}>
                  <Text style={styles.actionIcon}>📋</Text>
                  <Text style={styles.actionText}>Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Share Balance */}
            <View style={styles.shareSection}>
              <ReusableButton
                titleButton="Compartir Información de Saldo"
                onPressActionButton={shareBalanceInfo}
                buttonStyle={styles.shareButton}
                textButtonStyle={styles.shareButtonText}
              />
            </View>
          </>
        )}

        {/* Empty State */}
        {!selectedAccount && state.accounts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyTitle}>Sin Cuentas Disponibles</Text>
            <Text style={styles.emptyMessage}>
              No posee cuentas bancarias activas para consultar.
            </Text>
          </View>
        )}
      </ScrollView>

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
  selectorSection: {
    marginBottom: Metrics.xLarge,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
  },
  dropdown: {
    backgroundColor: Colors.white,
  },
  balanceCard: {
    backgroundColor: Colors.primary[400],
    borderRadius: 20,
    padding: Metrics.xLarge,
    marginBottom: Metrics.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.medium,
  },
  accountType: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  accountNumber: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'monospace',
    opacity: 0.9,
    marginBottom: Metrics.large,
  },
  balanceDisplay: {
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: Metrics.small,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: Metrics.small,
  },
  currency: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  lastUpdate: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Metrics.large,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Metrics.medium,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  creditValue: {
    color: Colors.feedback.success[300],
  },
  debitValue: {
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  averageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Metrics.large,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  averageLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  averageValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  actionsCard: {
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: Metrics.small,
    padding: Metrics.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: Metrics.medium,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  shareSection: {
    marginBottom: Metrics.large,
  },
  shareButton: {
    backgroundColor: Colors.secondary[400],
    paddingVertical: Metrics.large,
    borderRadius: 12,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.xLarge,
    minHeight: 300,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Metrics.large,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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

export default BalanceInquiryScreen;
