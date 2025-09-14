/**
 * @fileoverview TransactionHistoryScreen - Transaction history with filtering
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DropDownListReusable from '../../../../components/custom-dropdown/DropDownListReusable';
import CustomLoading from '../../../../components/custom-loading-reusable/CustomLoading';
import { Snackbar } from '../../../../components/snackbar/Snackbar';
import Colors from '../../../../themes/Colors';
import Metrics from '../../../../themes/Metrics';
import { handleApiError } from '../../../infrastructure/utils/errorHandler';
import { logger } from '../../../infrastructure/utils/logger';

// Mock services
import { getAccountsByUserId } from '../../../infrastructure/services/mock/data/mockAccounts';
import { getFilteredTransactions, type TransactionFilter } from '../../../infrastructure/services/mock/data/mockTransactions';
import type { BankAccount, Transaction, TransactionCategory } from '../../../shared/types';

/**
 * Filter state interface
 */
interface FilterState {
  accountId?: string;
  type?: 'debit' | 'credit' | 'transfer';
  category?: TransactionCategory;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Transaction history state interface
 */
interface TransactionHistoryState {
  transactions: Transaction[];
  accounts: BankAccount[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMoreData: boolean;
  showFilters: boolean;
  filters: FilterState;
  page: number;
  limit: number;
}

/**
 * TransactionHistoryScreen Component
 * Displays transaction history with advanced filtering options
 */
export const TransactionHistoryScreen: React.FC = () => {
  // Component state
  const [state, setState] = useState<TransactionHistoryState>({
    transactions: [],
    accounts: [],
    loading: true,
    refreshing: false,
    loadingMore: false,
    error: null,
    hasMoreData: true,
    showFilters: false,
    filters: {},
    page: 1,
    limit: 20,
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
   * Loads user accounts for filter dropdown
   */
  const loadAccounts = useCallback(async () => {
    try {
      const userAccounts = getAccountsByUserId(currentUserId);
      setState(prev => ({ ...prev, accounts: userAccounts }));
    } catch (error) {
      logger.error('❌ Failed to load accounts for filter', error, 'TRANSACTION_HISTORY_SCREEN');
    }
  }, [currentUserId]);

  /**
   * Loads transactions with current filters
   */
  const loadTransactions = useCallback(async (
    isRefreshing: boolean = false,
    isLoadingMore: boolean = false
  ) => {
    try {
      logger.info('📊 Loading transactions', { 
        isRefreshing, 
        isLoadingMore, 
        filters: state.filters 
      }, 'TRANSACTION_HISTORY_SCREEN');

      if (!isRefreshing && !isLoadingMore) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      } else if (isRefreshing) {
        setState(prev => ({ ...prev, refreshing: true, page: 1 }));
      } else if (isLoadingMore) {
        setState(prev => ({ ...prev, loadingMore: true }));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Prepare filter for API call
      const currentPage = isRefreshing ? 1 : (isLoadingMore ? state.page + 1 : state.page);
      const offset = (currentPage - 1) * state.limit;

      const filter: TransactionFilter = {
        ...state.filters,
      };

      // Load filtered transactions
      const filteredTransactions = getFilteredTransactions(filter, state.limit + 1, offset);
      const hasMore = filteredTransactions.length > state.limit;
      const transactions = hasMore ? filteredTransactions.slice(0, state.limit) : filteredTransactions;

      setState(prev => ({
        ...prev,
        transactions: isRefreshing || !isLoadingMore ? transactions : [...prev.transactions, ...transactions],
        loading: false,
        refreshing: false,
        loadingMore: false,
        error: null,
        hasMoreData: hasMore,
        page: currentPage,
      }));

      logger.info('✅ Transactions loaded successfully', {
        transactionCount: transactions.length,
        totalLoaded: isRefreshing || !isLoadingMore ? transactions.length : state.transactions.length + transactions.length,
        hasMore,
        page: currentPage,
      }, 'TRANSACTION_HISTORY_SCREEN');

    } catch (error) {
      const userMessage = handleApiError(error, {
        screen: 'TransactionHistoryScreen',
        action: 'loadTransactions'
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        loadingMore: false,
        error: userMessage.message,
      }));

      if (!isRefreshing && !isLoadingMore) {
        showSnackbar(userMessage.message, true);
      }

      logger.error('❌ Failed to load transactions', error, 'TRANSACTION_HISTORY_SCREEN');
    }
  }, [state.filters, state.limit, state.page, state.transactions.length, showSnackbar]);

  /**
   * Initial data load on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      logger.info('📊 Transaction history screen focused', undefined, 'TRANSACTION_HISTORY_SCREEN');
      loadAccounts();
      loadTransactions();
    }, [loadAccounts, loadTransactions])
  );

  /**
   * Pull to refresh handler
   */
  const handleRefresh = useCallback(() => {
    loadTransactions(true);
  }, [loadTransactions]);

  /**
   * Load more transactions (pagination)
   */
  const handleLoadMore = useCallback(() => {
    if (!state.loadingMore && state.hasMoreData) {
      loadTransactions(false, true);
    }
  }, [state.loadingMore, state.hasMoreData, loadTransactions]);

  /**
   * Toggle filters visibility
   */
  const toggleFilters = useCallback(() => {
    setState(prev => ({ ...prev, showFilters: !prev.showFilters }));
  }, []);

  /**
   * Apply filters
   */
  const applyFilters = useCallback((newFilters: FilterState) => {
    setState(prev => ({ 
      ...prev, 
      filters: newFilters, 
      showFilters: false,
      page: 1,
      transactions: [],
    }));
    
    // Load transactions with new filters
    setTimeout(() => {
      loadTransactions();
    }, 100);
    
    showSnackbar('Filtros aplicados correctamente', false);
  }, [loadTransactions, showSnackbar]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      filters: {},
      page: 1,
      transactions: [],
    }));
    
    setTimeout(() => {
      loadTransactions();
    }, 100);
    
    showSnackbar('Filtros eliminados', false);
  }, [loadTransactions, showSnackbar]);

  /**
   * Utility functions
   */
  const formatCurrency = useCallback((amount: number): string => {
    return `$${amount.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  }, []);

  const formatTransactionDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getTransactionIcon = useCallback((category: TransactionCategory): string => {
    switch (category) {
      case 'transfer': return '💸';
      case 'payment': return '💳';
      case 'deposit': return '💰';
      case 'withdrawal': return '🏧';
      case 'fee': return '📋';
      case 'interest': return '💎';
      default: return '📄';
    }
  }, []);

  const getCategoryText = useCallback((category: TransactionCategory): string => {
    switch (category) {
      case 'transfer': return 'Transferencia';
      case 'payment': return 'Pago';
      case 'deposit': return 'Depósito';
      case 'withdrawal': return 'Retiro';
      case 'fee': return 'Comisión';
      case 'interest': return 'Interés';
      default: return 'Transacción';
    }
  }, []);

  /**
   * Renders transaction item
   */
  const renderTransactionItem = useCallback(({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => {
        logger.info('📋 Transaction item pressed', { transactionId: item.id }, 'TRANSACTION_HISTORY_SCREEN');
        Alert.alert(
          'Detalle de Transacción',
          'Vista detallada de transacción no implementada aún',
          [{ text: 'Entendido' }]
        );
      }}
    >
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>
          {getTransactionIcon(item.category)}
        </Text>
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>
          {item.description}
        </Text>
        <Text style={styles.transactionCategory}>
          {getCategoryText(item.category)}
        </Text>
        <Text style={styles.transactionDate}>
          {formatTransactionDate(item.date)}
        </Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.transactionAmountText,
          item.type === 'credit' ? styles.positiveAmount : styles.negativeAmount
        ]}>
          {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
        <Text style={styles.transactionStatus}>
          {item.status === 'completed' ? 'Completada' : 
           item.status === 'pending' ? 'Pendiente' : 'Fallida'}
        </Text>
      </View>
    </TouchableOpacity>
  ), [formatCurrency, formatTransactionDate, getTransactionIcon, getCategoryText]);

  /**
   * Renders empty state
   */
  const renderEmptyState = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>Sin Transacciones</Text>
      <Text style={styles.emptyMessage}>
        No se encontraron transacciones con los filtros aplicados.
      </Text>
      <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
        <Text style={styles.clearFiltersButtonText}>Limpiar Filtros</Text>
      </TouchableOpacity>
    </View>
  ), [clearFilters]);

  /**
   * Renders list footer (load more indicator)
   */
  const renderListFooter = useCallback(() => {
    if (!state.loadingMore) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <CustomLoading size="small" color={Colors.primary[400]} />
        <Text style={styles.loadMoreText}>Cargando más transacciones...</Text>
      </View>
    );
  }, [state.loadingMore]);

  // Filter options
  const accountOptions = useMemo(() => [
    { label: 'Todas las cuentas', value: '' },
    ...state.accounts.map(account => ({
      label: `${account.accountType === 'savings' ? 'Ahorros' : 'Corriente'} *${account.accountNumber.slice(-4)}`,
      value: account.id
    }))
  ], [state.accounts]);

  const typeOptions = [
    { label: 'Todos los tipos', value: '' },
    { label: 'Ingresos', value: 'credit' },
    { label: 'Gastos', value: 'debit' },
    { label: 'Transferencias', value: 'transfer' },
  ];

  const categoryOptions = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Transferencias', value: 'transfer' },
    { label: 'Pagos', value: 'payment' },
    { label: 'Depósitos', value: 'deposit' },
    { label: 'Retiros', value: 'withdrawal' },
    { label: 'Comisiones', value: 'fee' },
    { label: 'Intereses', value: 'interest' },
  ];

  // Show loading state
  if (state.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de Transacciones</Text>
        </View>
        <View style={styles.loadingContainer}>
          <CustomLoading size="large" color={Colors.primary[400]} />
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (state.error && state.transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historial de Transacciones</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error al cargar transacciones</Text>
          <Text style={styles.errorMessage}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadTransactions()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Historial de Transacciones</Text>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
            <Text style={styles.filterButtonText}>🔍 Filtros</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {state.transactions.length} transacción{state.transactions.length !== 1 ? 'es' : ''} encontrada{state.transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Filters Panel */}
      {state.showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filtersPanelTitle}>Filtrar Transacciones</Text>
          
          {/* Account Filter */}
          <DropDownListReusable
            label="Cuenta"
            data={accountOptions}
            valueSelected={state.filters.accountId || ''}
            onChange={(value: any) => setState(prev => ({ 
              ...prev, 
              filters: { ...prev.filters, accountId: value || undefined }
            }))}
            customStyles={{
              container: styles.filterDropdown,
            }}
          />

          {/* Type Filter */}
          <DropDownListReusable
            label="Tipo"
            data={typeOptions}
            valueSelected={state.filters.type || ''}
            onChange={(value: any) => setState(prev => ({ 
              ...prev, 
              filters: { ...prev.filters, type: value as any || undefined }
            }))}
            customStyles={{
              container: styles.filterDropdown,
            }}
          />

          {/* Category Filter */}
          <DropDownListReusable
            label="Categoría"
            data={categoryOptions}
            valueSelected={state.filters.category || ''}
            onChange={(value: any) => setState(prev => ({ 
              ...prev, 
              filters: { ...prev.filters, category: value as any || undefined }
            }))}
            customStyles={{
              container: styles.filterDropdown,
            }}
          />

          {/* Filter Actions */}
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={[styles.filterActionButton, styles.clearButton]} 
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterActionButton, styles.applyButton]} 
              onPress={() => applyFilters(state.filters)}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Transactions List */}
      <FlatList
        data={state.transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          state.transactions.length === 0 && styles.listContentEmpty
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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderListFooter}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Metrics.small,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterButton: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.primary[400],
    fontWeight: '500',
  },
  filtersPanel: {
    backgroundColor: Colors.white,
    padding: Metrics.large,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
  },
  filterDropdown: {
    marginBottom: Metrics.medium,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.large,
  },
  filterActionButton: {
    flex: 1,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: Colors.neutral[200],
    marginRight: Metrics.medium,
  },
  clearButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: Colors.primary[400],
    marginLeft: Metrics.medium,
  },
  applyButtonText: {
    color: Colors.white,
    fontWeight: '500',
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
  transactionItem: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.large,
    marginBottom: Metrics.medium,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Metrics.medium,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionInfo: {
    flex: 1,
    marginRight: Metrics.medium,
  },
  transactionDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: Metrics.small,
  },
  transactionCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Metrics.small,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Metrics.small,
  },
  transactionStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  positiveAmount: {
    color: Colors.feedback.success[300],
  },
  negativeAmount: {
    color: Colors.textPrimary,
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
  clearFiltersButton: {
    backgroundColor: Colors.primary[400],
    paddingHorizontal: Metrics.xLarge,
    paddingVertical: Metrics.medium,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
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
  loadMoreContainer: {
    padding: Metrics.large,
    alignItems: 'center',
  },
  loadMoreText: {
    marginTop: Metrics.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default TransactionHistoryScreen;
