/**
 * @fileoverview Home Screen - Main dashboard for banking app
 * @author Eduardo Valenzuela
 * @version 2.0.0 - Simplified
 */

import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackNavigationProp } from '../../../../types/navigation';

// Theme imports
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services (would be replaced with real API calls)
import { getAccountsByUserId, getTotalBalance } from '../../../infrastructure/services/mock/data/mockAccounts';
import { getRecentTransactions } from '../../../infrastructure/services/mock/data/mockTransactions';

// Components
import { Snackbar } from '../../../../components/snackbar/Snackbar';

/**
 * Home screen state interface
 */
interface HomeState {
  accounts: any[];
  recentTransactions: any[];
  totalBalance: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasAccounts: boolean;
}

/**
 * Home Screen Component - Simplified
 * 
 * Main dashboard showing account balances, recent transactions, and quick actions
 */
const HomeScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'Home'>>();

  // Component state
  const [state, setState] = useState<HomeState>({
    accounts: [],
    recentTransactions: [],
    totalBalance: 0,
    loading: true,
    refreshing: false,
    error: null,
    hasAccounts: false,
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
   * Simple error handling
   */
  const handleError = useCallback((error: any) => {
    const message = error?.message || 'An error occurred';
    logger.error('HomeScreen error', error, 'HOME_SCREEN');
    return { message, isError: true };
  }, []);

  /**
   * Loads banking data - simplified version
   */
  const loadBankingData = useCallback(async (isRefreshing: boolean = false) => {
    try {
      logger.info('🏠 Loading banking data', { isRefreshing }, 'HOME_SCREEN');

      if (!isRefreshing) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      } else {
        setState(prev => ({ ...prev, refreshing: true }));
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const userAccounts = getAccountsByUserId(currentUserId);
      const totalBalance = getTotalBalance(currentUserId);
      const accountIds = userAccounts.map(account => account.id);
      const recentTransactions = getRecentTransactions(accountIds, 5);

      setState(prev => ({
        ...prev,
        accounts: userAccounts,
        totalBalance,
        recentTransactions,
        hasAccounts: userAccounts.length > 0,
        loading: false,
        refreshing: false,
        error: null,
      }));

      logger.info('✅ Banking data loaded successfully', {
        accountCount: userAccounts.length,
        totalBalance,
        transactionCount: recentTransactions.length,
      }, 'HOME_SCREEN');

    } catch (error) {
      const userMessage = handleError(error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: userMessage.message,
      }));

      showSnackbar(userMessage.message, true);
      logger.error('❌ Failed to load banking data', error, 'HOME_SCREEN');
    }
  }, [handleError, showSnackbar]);

  /**
   * Initial data load
   */
  useEffect(() => {
    loadBankingData();
  }, [loadBankingData]);

  /**
   * Pull to refresh handler
   */
  const handleRefresh = useCallback(() => {
    loadBankingData(true);
  }, [loadBankingData]);

  /**
   * Handle quick actions
   */
  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'balance':
        navigation.navigate('BalanceInquiry' as any);
        break;
      case 'transactions':
        navigation.navigate('TransactionHistory' as any);
        break;
      case 'transfer':
        navigation.navigate('Transfer' as any);
        break;
      default:
        showSnackbar('Función no disponible', true);
    }
  }, [navigation, showSnackbar]);

  /**
   * Navigate to transaction history
   */
  const handleRecentTransactions = useCallback(() => {
    navigation.navigate('TransactionHistory' as any);
  }, [navigation]);

  /**
   * Format currency
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  /**
   * Get greeting based on time
   */
  const getGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error && !state.hasAccounts) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error cargando información</Text>
          <Text style={styles.errorMessage}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadBankingData(false)}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.timeText}>{getGreeting}</Text>
        </View>

        {/* Balance Card */}
        {state.hasAccounts ? (
          <View style={styles.balanceCard}>
            <Text style={styles.accountLabel}>
              {state.accounts.length > 1 ? 'Balance Total' : 'Mi Cuenta'}
            </Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(state.totalBalance)}
            </Text>
            <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          </View>
        ) : (
          <View style={styles.noAccountsCard}>
            <Text style={styles.noAccountsTitle}>Sin Cuentas</Text>
            <Text style={styles.noAccountsMessage}>
              No posee cuentas bancarias registradas.{'\n'}
              Comuníquese con su banco para más información.
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('balance')}
              disabled={!state.hasAccounts}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Consultar{'\n'}Saldo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('transactions')}
              disabled={!state.hasAccounts}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Transacciones{'\n'}Recientes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('transfer')}
              disabled={!state.hasAccounts}
            >
              <Text style={styles.quickActionIcon}>💸</Text>
              <Text style={styles.quickActionText}>Transferir{'\n'}Dinero</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        {state.recentTransactions.length > 0 ? (
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsSectionHeader}>
              <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
              <TouchableOpacity onPress={handleRecentTransactions}>
                <Text style={styles.viewAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {state.recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString('es-DO')}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'credit' ? styles.positiveAmount : styles.negativeAmount
                ]}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyTransactionsSection}>
            <Text style={styles.sectionTitle}>Transacciones Recientes</Text>
            <View style={styles.emptyTransactionsCard}>
              <Text style={styles.emptyTransactionsIcon}>📋</Text>
              <Text style={styles.emptyTransactionsTitle}>Sin transacciones</Text>
              <Text style={styles.emptyTransactionsMessage}>
                No hay transacciones recientes para mostrar.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        duration={3000}
        backgroundColorSnack={snackbar.isError ? '#FF6B6B' : '#4CAF50'}
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
  scrollContentContainer: {
    paddingBottom: Metrics.xxLarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.large,
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
    padding: Metrics.large,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Metrics.medium,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Metrics.large,
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
    fontWeight: '600',
  },
  header: {
    padding: Metrics.large,
    paddingTop: Metrics.medium,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  timeText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  balanceCard: {
    backgroundColor: Colors.primary[400],
    marginHorizontal: Metrics.large,
    marginBottom: Metrics.large,
    padding: Metrics.xLarge,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  noAccountsCard: {
    backgroundColor: Colors.accent.warning[100],
    marginHorizontal: Metrics.large,
    marginBottom: Metrics.large,
    padding: Metrics.xLarge,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent.warning[200],
  },
  noAccountsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent.warning[300],
    marginBottom: Metrics.small,
  },
  noAccountsMessage: {
    fontSize: 14,
    color: Colors.accent.warning[300],
    textAlign: 'center',
    lineHeight: 20,
  },
  accountLabel: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
    marginBottom: Metrics.small,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: Metrics.small,
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
  quickActionsSection: {
    paddingHorizontal: Metrics.large,
    marginBottom: Metrics.xLarge,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: Metrics.small,
    padding: Metrics.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: Metrics.small,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  transactionsSection: {
    paddingHorizontal: Metrics.large,
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
  transactionItem: {
    backgroundColor: Colors.white,
    padding: Metrics.large,
    borderRadius: 12,
    marginBottom: Metrics.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
    marginRight: Metrics.medium,
  },
  transactionDescription: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: Metrics.small,
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: Colors.secondary[300],
  },
  negativeAmount: {
    color: Colors.feedback.error[300],
  },
  emptyTransactionsSection: {
    paddingHorizontal: Metrics.large,
  },
  emptyTransactionsCard: {
    backgroundColor: Colors.white,
    padding: Metrics.xLarge,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyTransactionsIcon: {
    fontSize: 48,
    marginBottom: Metrics.medium,
  },
  emptyTransactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  emptyTransactionsMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;