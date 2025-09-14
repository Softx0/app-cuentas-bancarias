/**
 * @fileoverview AccountListScreen - Display user's bank accounts
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
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
import { getAccountsByUserId } from '../../../infrastructure/services/mock/data/mockAccounts';
import type { BankAccount } from '../../../shared/types';

/**
 * Account list state interface
 */
interface AccountListState {
  accounts: BankAccount[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasData: boolean;
}

/**
 * AccountListScreen Component
 * Displays user's bank accounts with navigation to detail view
 */
export const AccountListScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation<RootStackNavigationProp<'AccountList'>>();

  // Component state
  const [state, setState] = useState<AccountListState>({
    accounts: [],
    loading: true,
    refreshing: false,
    error: null,
    hasData: false,
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
  const loadAccounts = useCallback(async (isRefreshing: boolean = false) => {
    try {
      logger.info('🏦 Loading user accounts', { isRefreshing }, 'ACCOUNT_LIST_SCREEN');

      if (!isRefreshing) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      } else {
        setState(prev => ({ ...prev, refreshing: true }));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Load user accounts
      const userAccounts = getAccountsByUserId(currentUserId);

      setState(prev => ({
        ...prev,
        accounts: userAccounts,
        hasData: userAccounts.length > 0,
        loading: false,
        refreshing: false,
        error: null,
      }));

      logger.info('✅ Accounts loaded successfully', {
        accountCount: userAccounts.length,
      }, 'ACCOUNT_LIST_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'AccountListScreen',
        action: 'loadAccounts'
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

      logger.error('❌ Failed to load accounts', error, 'ACCOUNT_LIST_SCREEN');
    }
  }, [currentUserId, showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('🏦 Account list screen focused', undefined, 'ACCOUNT_LIST_SCREEN');
      loadAccounts();
    }, [loadAccounts])
  );

  /**
   * Pull to refresh handler
   */
  const handleRefresh = useCallback(() => {
    loadAccounts(true);
  }, [loadAccounts]);

  /**
   * Navigates to account detail
   */
  const handleAccountPress = useCallback((account: BankAccount) => {
    logger.info('📋 Navigate to account detail', { accountId: account.id }, 'ACCOUNT_LIST_SCREEN');
    navigation.navigate('AccountDetail', { 
      accountId: account.id,
      accountName: `${account.accountType === 'savings' ? 'Ahorros' : 'Corriente'} *${account.accountNumber.slice(-4)}`
    });
  }, [navigation]);

  /**
   * Formats currency for display
   */
  const formatCurrency = useCallback((amount: number): string => {
    return `$${amount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }, []);

  /**
   * Formats account number for display
   */
  const formatAccountNumber = useCallback((accountNumber: string): string => {
    if (accountNumber.length < 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    return `**** ${lastFour}`;
  }, []);

  /**
   * Gets account type display text
   */
  const getAccountTypeText = useCallback((type: 'savings' | 'checking'): string => {
    return type === 'savings' ? 'Ahorros' : 'Corriente';
  }, []);

  /**
   * Renders account item
   */
  const renderAccountItem = useCallback(({ item }: { item: BankAccount }) => (
    <TouchableOpacity 
      style={styles.accountCard}
      onPress={() => handleAccountPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.accountHeader}>
        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountType}>
            {getAccountTypeText(item.accountType)}
          </Text>
          <View style={[
            styles.accountStatusDot,
            { backgroundColor: item.isActive ? Colors.feedback.success[300] : Colors.feedback.error[300] }
          ]} />
        </View>
        <Text style={styles.accountNumber}>
          {formatAccountNumber(item.accountNumber)}
        </Text>
      </View>

      <View style={styles.accountBody}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(item.balance)}
        </Text>
        <Text style={styles.currency}>{item.currency}</Text>
      </View>

      <View style={styles.accountFooter}>
        <Text style={styles.lastUpdateText}>
          Última transacción: {item.lastTransactionDate.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
        <Text style={styles.viewDetailText}>Ver detalles →</Text>
      </View>
    </TouchableOpacity>
  ), [handleAccountPress, formatCurrency, formatAccountNumber, getAccountTypeText]);

  /**
   * Renders empty state
   */
  const renderEmptyState = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏦</Text>
      <Text style={styles.emptyTitle}>Sin Cuentas Bancarias</Text>
      <Text style={styles.emptyMessage}>
        No tienes cuentas bancarias registradas en este momento.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => loadAccounts()}>
        <Text style={styles.emptyButtonText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  ), [loadAccounts]);

  /**
   * Renders error state
   */
  const renderErrorState = useMemo(() => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>❌</Text>
      <Text style={styles.errorTitle}>Error al cargar cuentas</Text>
      <Text style={styles.errorMessage}>{state.error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadAccounts()}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  ), [state.error, loadAccounts]);

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Cuentas</Text>
        </View>
        <View style={styles.loadingContainer}>
          <CustomLoading size="large" color={Colors.primary[400]} />
          <Text style={styles.loadingText}>Cargando cuentas bancarias...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error && !state.hasData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Cuentas</Text>
        </View>
        {renderErrorState}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Cuentas</Text>
        <Text style={styles.headerSubtitle}>
          {state.accounts.length} cuenta{state.accounts.length !== 1 ? 's' : ''} disponible{state.accounts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Accounts List */}
      <FlatList
        data={state.accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          state.accounts.length === 0 && styles.listContentEmpty
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[400]]}
            tintColor={Colors.primary[400]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

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
  list: {
    flex: 1,
  },
  listContent: {
    padding: Metrics.large,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  accountCard: {
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
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: Metrics.medium,
  },
  accountStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  accountBody: {
    alignItems: 'center',
    marginBottom: Metrics.large,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Metrics.small,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
  },
  currency: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  viewDetailText: {
    fontSize: 14,
    color: Colors.primary[400],
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.xLarge,
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
    marginBottom: Metrics.xLarge,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: Colors.primary[400],
    paddingHorizontal: Metrics.xLarge,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
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

export default AccountListScreen;
