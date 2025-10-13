/**
 * @fileoverview AccountDetailScreen - Detailed view of a specific bank account
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { RootStackNavigationProp } from '../../../../types/navigation';

import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { handleApiError } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services
// TODO: Reemplazar infraestructure por useBanking del Context para cumplir con Clean Architecture

import { getAccountById } from '../../../infrastructure/services/mock/data/mockAccounts';
import { getTransactionsByAccountId, getTransactionStats } from '../../../infrastructure/services/mock/data/mockTransactions';
import type { BankAccount, Transaction } from '../../../shared/types';

/**
 * Account detail state interface
 */
interface AccountDetailState {
  account: BankAccount | null;
  recentTransactions: Transaction[];
  monthlyStats: {
    totalDebits: number;
    totalCredits: number;
    transactionCount: number;
  };
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

/**
 * AccountDetailScreen Component
 * Displays detailed information about a specific bank account
 */
export const AccountDetailScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'AccountDetail'>>();

  // Component state
  const [state, setState] = useState<AccountDetailState>({
    account: null,
    recentTransactions: [],
    monthlyStats: {
      totalDebits: 0,
      totalCredits: 0,
      transactionCount: 0,
    },
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


  // Mock account ID (in real app, this would come from navigation params)
  const accountId = 'acc_001';

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
   * Loads account details and recent transactions
   */
  const loadAccountDetails = useCallback(async (isRefreshing: boolean = false) => {
    try {
      logger.info('🏦 Loading account details', { accountId, isRefreshing }, 'ACCOUNT_DETAIL_SCREEN');

      if (!isRefreshing) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      } else {
        setState(prev => ({ ...prev, refreshing: true }));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load account data
      const account = getAccountById(accountId);
      if (!account) {
        throw new Error('Cuenta no encontrada');
      }

      // Load recent transactions
      const recentTransactions = getTransactionsByAccountId(accountId, 10);

      // Calculate monthly stats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const stats = getTransactionStats(accountId, thirtyDaysAgo);

      setState(prev => ({
        ...prev,
        account,
        recentTransactions,
        monthlyStats: {
          totalDebits: stats.totalDebits,
          totalCredits: stats.totalCredits,
          transactionCount: stats.totalTransactions,
        },
        loading: false,
        refreshing: false,
        error: null,
      }));

      logger.info('✅ Account details loaded successfully', {
        accountId: account.id,
        transactionCount: recentTransactions.length,
      }, 'ACCOUNT_DETAIL_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'AccountDetailScreen',
        action: 'loadAccountDetails'
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: userMessage.message,
      }));

      if (!isRefreshing) {
        showSnackbar(userMessage.message, true);
      }

      logger.error('❌ Failed to load account details', error, 'ACCOUNT_DETAIL_SCREEN');
    }
  }, [accountId, showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('🏦 Account detail screen focused', { accountId }, 'ACCOUNT_DETAIL_SCREEN');
      loadAccountDetails();
    }, [loadAccountDetails, accountId])
  );

  /**
   * Pull to refresh handler
   */
  const handleRefresh = useCallback(() => {
    loadAccountDetails(true);
  }, [loadAccountDetails]);

  /**
   * Navigation handlers
   */
  const handleTransferMoney = useCallback(() => {
    logger.info('💸 Transfer money action', { accountId }, 'ACCOUNT_DETAIL_SCREEN');
    navigation.navigate('Transfer', { fromAccountId: accountId });
  }, [accountId, navigation]);

  const handleViewAllTransactions = useCallback(() => {
    logger.info('📊 View all transactions action', { accountId }, 'ACCOUNT_DETAIL_SCREEN');
    navigation.navigate('TransactionHistory', { accountId });
  }, [accountId, navigation]);

  const handleAccountSettings = useCallback(() => {
    logger.info('⚙️ Account settings action', { accountId }, 'ACCOUNT_DETAIL_SCREEN');
    navigation.navigate('BalanceInquiry', { accountId });
  }, [accountId, navigation]);

  /**
   * Utility functions
   */
  const formatCurrency = useCallback((amount: number): string => {
    return `$${amount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
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

  const formatTransactionDate = useCallback((date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  /**
   * Renders transaction item
   */
  const renderTransactionItem = useCallback((transaction: Transaction) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>
          {transaction.description}
        </Text>
        <Text style={styles.transactionDate}>
          {formatTransactionDate(transaction.date)}
        </Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        transaction.type === 'credit' ? styles.positiveAmount : styles.negativeAmount
      ]}>
        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  ), [formatTransactionDate, formatCurrency]);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <CustomLoading size="large" color={Colors.primary[400]} />
          <Text style={styles.loadingText}>Cargando detalles de la cuenta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error || !state.account) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error al cargar cuenta</Text>
          <Text style={styles.errorMessage}>
            {state.error || 'No se pudo encontrar la información de la cuenta'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadAccountDetails()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { account, recentTransactions, monthlyStats } = state;

  return (
    <SafeAreaView style={styles.container}>
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
        {/* Account Header */}
        <View style={styles.accountHeader}>
          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountType}>
              {getAccountTypeText(account.accountType)}
            </Text>
            <View style={[
              styles.statusDot,
              { backgroundColor: account.isActive ? Colors.feedback.success[300] : Colors.feedback.error[300] }
            ]} />
          </View>
          <Text style={styles.accountNumber}>
            {formatAccountNumber(account.accountNumber)}
          </Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(account.balance)}
          </Text>
          <Text style={styles.currency}>{account.currency}</Text>
          <Text style={styles.lastUpdateText}>
            Actualizado: {account.lastTransactionDate.toLocaleDateString('es-CO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleTransferMoney}>
              <Text style={styles.actionIcon}>💸</Text>
              <Text style={styles.actionText}>Transferir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleViewAllTransactions}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Historial</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleAccountSettings}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Configurar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumen del Mes</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{monthlyStats.transactionCount}</Text>
              <Text style={styles.statLabel}>Transacciones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.creditAmount]}>
                {formatCurrency(monthlyStats.totalCredits)}
              </Text>
              <Text style={styles.statLabel}>Ingresos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.debitAmount]}>
                {formatCurrency(monthlyStats.totalDebits)}
              </Text>
              <Text style={styles.statLabel}>Gastos</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsSectionHeader}>
            <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.map(renderTransactionItem)}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsIcon}>📋</Text>
              <Text style={styles.emptyTransactionsText}>
                No hay transacciones recientes
              </Text>
            </View>
          )}
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Metrics.xxLarge,
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
  accountHeader: {
    backgroundColor: Colors.white,
    padding: Metrics.large,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metrics.small,
  },
  accountType: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: Metrics.medium,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountNumber: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  balanceCard: {
    backgroundColor: Colors.primary[400],
    margin: Metrics.large,
    padding: Metrics.xLarge,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.9,
    marginBottom: Metrics.medium,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: Metrics.small,
  },
  currency: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Metrics.large,
  },
  lastUpdateText: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
  actionsSection: {
    marginHorizontal: Metrics.large,
    marginBottom: Metrics.xLarge,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small,
    padding: Metrics.large,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
  statsSection: {
    marginHorizontal: Metrics.large,
    marginBottom: Metrics.xLarge,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small,
    padding: Metrics.large,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  creditAmount: {
    color: Colors.feedback.success[300],
  },
  debitAmount: {
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  transactionsSection: {
    marginHorizontal: Metrics.large,
    marginBottom: Metrics.xLarge,
  },
  transactionsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary[400],
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    padding: Metrics.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionInfo: {
    flex: 1,
    marginRight: Metrics.large,
  },
  transactionDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: Metrics.small,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: Colors.feedback.success[300],
  },
  negativeAmount: {
    color: Colors.textPrimary,
  },
  emptyTransactions: {
    backgroundColor: Colors.white,
    padding: Metrics.xxLarge,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTransactionsIcon: {
    fontSize: 48,
    marginBottom: Metrics.large,
    opacity: 0.5,
  },
  emptyTransactionsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default AccountDetailScreen;
