/**
 * @fileoverview Banking context for managing banking data and transactions
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { createContext, useCallback, useContext, useReducer } from 'react';

import { logger } from '../../infrastructure/utils/logger';
import type { BankAccount, Transaction } from '../../shared/types';

// Mock services for data
import { getAccountsByUserId, updateAccountBalance } from '../../infrastructure/services/mock/data/mockAccounts';
import { createTransaction, getFilteredTransactions } from '../../infrastructure/services/mock/data/mockTransactions';

/**
 * Banking state interface
 */
interface BankingState {
  accounts: BankAccount[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Banking actions
 */
type BankingAction =
  | { type: 'BANKING_LOADING'; payload: boolean }
  | { type: 'BANKING_ERROR'; payload: string }
  | { type: 'ACCOUNTS_LOADED'; payload: BankAccount[] }
  | { type: 'TRANSACTIONS_LOADED'; payload: Transaction[] }
  | { type: 'ACCOUNT_UPDATED'; payload: BankAccount }
  | { type: 'TRANSACTION_ADDED'; payload: Transaction }
  | { type: 'TRANSFER_COMPLETED'; payload: { debitTransaction: Transaction; creditTransaction: Transaction; fromAccount: BankAccount; toAccount: BankAccount } }
  | { type: 'CLEAR_BANKING_DATA' };

/**
 * Banking context value interface
 */
interface BankingContextValue extends BankingState {
  // Data loading methods
  loadUserAccounts: (userId: string) => Promise<void>;
  loadTransactions: (accountIds?: string[]) => Promise<void>;
  
  // Account methods
  getAccountById: (accountId: string) => BankAccount | null;
  getTotalBalance: (accountIds?: string[]) => number;
  
  // Transaction methods
  executeTransfer: (transferData: TransferData) => Promise<{ debitTransaction: Transaction; creditTransaction: Transaction }>;
  getAccountTransactions: (accountId: string, limit?: number) => Transaction[];
  getRecentTransactions: (accountIds: string[], limit?: number) => Transaction[];
  
  // Utility methods
  refreshData: (userId: string) => Promise<void>;
  clearBankingData: () => void;
}

/**
 * Transfer data interface
 */
interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  reference?: string;
}

/**
 * Initial banking state
 */
const initialState: BankingState = {
  accounts: [],
  transactions: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Banking reducer
 * @param state Current banking state
 * @param action Banking action
 * @returns New banking state
 */
const bankingReducer = (state: BankingState, action: BankingAction): BankingState => {
  logger.debug('Banking reducer action', { type: action.type }, 'BANKING');
  
  switch (action.type) {
    case 'BANKING_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };
      
    case 'BANKING_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case 'ACCOUNTS_LOADED':
      return {
        ...state,
        accounts: action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      };
      
    case 'TRANSACTIONS_LOADED':
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      };
      
    case 'ACCOUNT_UPDATED':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        ),
        lastUpdated: new Date(),
      };
      
    case 'TRANSACTION_ADDED':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        lastUpdated: new Date(),
      };
      
    case 'TRANSFER_COMPLETED':
      const { debitTransaction, creditTransaction, fromAccount, toAccount } = action.payload;
      return {
        ...state,
        accounts: state.accounts.map(account => {
          if (account.id === fromAccount.id) return fromAccount;
          if (account.id === toAccount.id) return toAccount;
          return account;
        }),
        transactions: [creditTransaction, debitTransaction, ...state.transactions],
        lastUpdated: new Date(),
      };
      
    case 'CLEAR_BANKING_DATA':
      return initialState;
      
    default:
      return state;
  }
};

/**
 * Banking context
 */
const BankingContext = createContext<BankingContextValue | undefined>(undefined);

/**
 * Banking context provider props
 */
interface BankingProviderProps {
  children: React.ReactNode;
}

/**
 * Banking context provider component
 * @param props Provider props
 * @returns BankingProvider component
 */
export const BankingProvider: React.FC<BankingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bankingReducer, initialState);

  /**
   * Loads user accounts
   * @param userId User ID
   */
  const loadUserAccounts = useCallback(async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'BANKING_LOADING', payload: true });
      
      logger.info('Loading user accounts', { userId }, 'BANKING');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const accounts = getAccountsByUserId(userId);
      
      dispatch({ type: 'ACCOUNTS_LOADED', payload: accounts });
      
      logger.info('User accounts loaded successfully', { 
        userId, 
        accountCount: accounts.length 
      }, 'BANKING');
    } catch (error) {
      const errorMessage = 'Failed to load user accounts';
      dispatch({ type: 'BANKING_ERROR', payload: errorMessage });
      logger.error('Failed to load user accounts', error, 'BANKING');
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Loads transactions for specified accounts
   * @param accountIds Account IDs to load transactions for
   */
  const loadTransactions = useCallback(async (accountIds?: string[]): Promise<void> => {
    try {
      dispatch({ type: 'BANKING_LOADING', payload: true });
      
      logger.info('Loading transactions', { accountIds }, 'BANKING');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const transactions = getFilteredTransactions({ accountId: accountIds?.[0] }, 100, 0);
      
      dispatch({ type: 'TRANSACTIONS_LOADED', payload: transactions });
      
      logger.info('Transactions loaded successfully', { 
        transactionCount: transactions.length 
      }, 'BANKING');
    } catch (error) {
      const errorMessage = 'Failed to load transactions';
      dispatch({ type: 'BANKING_ERROR', payload: errorMessage });
      logger.error('Failed to load transactions', error, 'BANKING');
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Gets account by ID
   * @param accountId Account ID
   * @returns Account or null
   */
  const getAccountById = useCallback((accountId: string): BankAccount | null => {
    return state.accounts.find(account => account.id === accountId) || null;
  }, [state.accounts]);

  /**
   * Gets total balance for specified accounts or all accounts
   * @param accountIds Account IDs to calculate total for
   * @returns Total balance
   */
  const getTotalBalance = useCallback((accountIds?: string[]): number => {
    const accountsToSum = accountIds 
      ? state.accounts.filter(account => accountIds.includes(account.id))
      : state.accounts;
    
    return accountsToSum.reduce((total, account) => total + account.balance, 0);
  }, [state.accounts]);

  /**
   * Executes a transfer between accounts
   * @param transferData Transfer information
   * @returns Created transactions
   */
  const executeTransfer = useCallback(async (transferData: TransferData): Promise<{ debitTransaction: Transaction; creditTransaction: Transaction }> => {
    try {
      const { fromAccountId, toAccountId, amount, description, reference } = transferData;
      
      logger.info('Executing transfer', transferData, 'BANKING');
      
      // Get accounts
      const fromAccount = getAccountById(fromAccountId);
      const toAccount = getAccountById(toAccountId);
      
      if (!fromAccount || !toAccount) {
        throw new Error('Account not found');
      }
      
      if (fromAccount.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const transferReference = reference || `TRF-${Date.now()}`;
      
      // Create transactions
      const debitTransaction = createTransaction({
        accountId: fromAccountId,
        type: 'debit',
        amount,
        description,
        category: 'transfer',
        date: now,
        status: 'completed',
        reference: transferReference,
        toAccountId,
      });
      
      const creditTransaction = createTransaction({
        accountId: toAccountId,
        type: 'credit',
        amount,
        description,
        category: 'transfer',
        date: now,
        status: 'completed',
        reference: transferReference,
        toAccountId: fromAccountId,
      });
      
      // Update account balances
      const updatedFromAccount = {
        ...fromAccount,
        balance: fromAccount.balance - amount,
        lastTransactionDate: now,
      };
      
      const updatedToAccount = {
        ...toAccount,
        balance: toAccount.balance + amount,
        lastTransactionDate: now,
      };
      
      // Update mock data
      updateAccountBalance(fromAccountId, updatedFromAccount.balance);
      updateAccountBalance(toAccountId, updatedToAccount.balance);
      
      // Update state
      dispatch({ 
        type: 'TRANSFER_COMPLETED', 
        payload: { 
          debitTransaction, 
          creditTransaction, 
          fromAccount: updatedFromAccount, 
          toAccount: updatedToAccount 
        }
      });
      
      logger.info('Transfer completed successfully', {
        fromAccountId,
        toAccountId,
        amount,
        debitTransactionId: debitTransaction.id,
        creditTransactionId: creditTransaction.id,
      }, 'BANKING');
      
      return { debitTransaction, creditTransaction };
    } catch (error) {
      logger.error('Transfer failed', error, 'BANKING');
      throw error;
    }
  }, [getAccountById]);

  /**
   * Gets transactions for a specific account
   * @param accountId Account ID
   * @param limit Number of transactions to return
   * @returns Account transactions
   */
  const getAccountTransactions = useCallback((accountId: string, limit: number = 10): Transaction[] => {
    return state.transactions
      .filter(transaction => transaction.accountId === accountId)
      .slice(0, limit);
  }, [state.transactions]);

  /**
   * Gets recent transactions for specified accounts
   * @param accountIds Account IDs
   * @param limit Number of transactions to return
   * @returns Recent transactions
   */
  const getRecentTransactions = useCallback((accountIds: string[], limit: number = 5): Transaction[] => {
    return state.transactions
      .filter(transaction => accountIds.includes(transaction.accountId))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }, [state.transactions]);

  /**
   * Refreshes all banking data
   * @param userId User ID
   */
  const refreshData = useCallback(async (userId: string): Promise<void> => {
    try {
      await loadUserAccounts(userId);
      
      if (state.accounts.length > 0) {
        const accountIds = state.accounts.map(account => account.id);
        await loadTransactions(accountIds);
      }
    } catch (error) {
      logger.error('Failed to refresh banking data', error, 'BANKING');
      throw error;
    }
  }, [loadUserAccounts, loadTransactions, state.accounts]);

  /**
   * Clears all banking data
   */
  const clearBankingData = useCallback((): void => {
    logger.info('Clearing banking data', undefined, 'BANKING');
    dispatch({ type: 'CLEAR_BANKING_DATA' });
  }, []);

  const contextValue: BankingContextValue = {
    ...state,
    loadUserAccounts,
    loadTransactions,
    getAccountById,
    getTotalBalance,
    executeTransfer,
    getAccountTransactions,
    getRecentTransactions,
    refreshData,
    clearBankingData,
  };

  return (
    <BankingContext.Provider value={contextValue}>
      {children}
    </BankingContext.Provider>
  );
};

/**
 * Hook to use banking context
 * @returns Banking context value
 * @throws Error if used outside BankingProvider
 */
export const useBanking = (): BankingContextValue => {
  const context = useContext(BankingContext);
  
  if (context === undefined) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  
  return context;
};
