/**
 * @fileoverview Mock transaction data for banking app simulation
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import type { Transaction, TransactionCategory } from '../../../../shared/types';

/**
 * Mock transactions database
 */
export const mockTransactions: Transaction[] = [
  // Eduardo's account transactions (acc_001 - checking)
  {
    id: 'txn_001',
    accountId: 'acc_001',
    type: 'credit',
    amount: 2500.00,
    description: 'Salary deposit',
    category: 'deposit',
    date: new Date(),
    status: 'completed',
    reference: 'SAL-2024-001',
  },
  {
    id: 'txn_002',
    accountId: 'acc_001',
    type: 'debit',
    amount: 850.75,
    description: 'Grocery shopping',
    category: 'payment',
    date: new Date(Date.now() - 86400000), // 1 day ago
    status: 'completed',
    reference: 'POS-2024-001',
  },
  {
    id: 'txn_003',
    accountId: 'acc_001',
    type: 'debit',
    amount: 1200.00,
    description: 'Rent payment',
    category: 'payment',
    date: new Date(Date.now() - 172800000), // 2 days ago
    status: 'completed',
    reference: 'RENT-2024-001',
  },
  {
    id: 'txn_004',
    accountId: 'acc_001',
    type: 'transfer',
    amount: 500.00,
    description: 'Transfer to savings',
    category: 'transfer',
    date: new Date(Date.now() - 259200000), // 3 days ago
    status: 'completed',
    reference: 'TRF-2024-001',
    toAccountId: 'acc_002',
  },
  {
    id: 'txn_005',
    accountId: 'acc_001',
    type: 'debit',
    amount: 45.00,
    description: 'ATM withdrawal',
    category: 'withdrawal',
    date: new Date(Date.now() - 345600000), // 4 days ago
    status: 'completed',
    reference: 'ATM-2024-001',
  },

  // Eduardo's savings account transactions (acc_002)
  {
    id: 'txn_006',
    accountId: 'acc_002',
    type: 'credit',
    amount: 500.00,
    description: 'Transfer from checking',
    category: 'transfer',
    date: new Date(Date.now() - 259200000), // 3 days ago
    status: 'completed',
    reference: 'TRF-2024-001',
  },
  {
    id: 'txn_007',
    accountId: 'acc_002',
    type: 'credit',
    amount: 125.50,
    description: 'Interest payment',
    category: 'interest',
    date: new Date(Date.now() - 604800000), // 1 week ago
    status: 'completed',
    reference: 'INT-2024-001',
  },

  // María's checking account transactions (acc_003)
  {
    id: 'txn_008',
    accountId: 'acc_003',
    type: 'credit',
    amount: 1800.00,
    description: 'Salary deposit',
    category: 'deposit',
    date: new Date(Date.now() - 43200000), // 12 hours ago
    status: 'completed',
    reference: 'SAL-2024-002',
  },
  {
    id: 'txn_009',
    accountId: 'acc_003',
    type: 'debit',
    amount: 680.25,
    description: 'Utilities payment',
    category: 'payment',
    date: new Date(Date.now() - 86400000), // 1 day ago
    status: 'completed',
    reference: 'UTIL-2024-001',
  },
  {
    id: 'txn_010',
    accountId: 'acc_003',
    type: 'debit',
    amount: 25.00,
    description: 'Bank fee',
    category: 'fee',
    date: new Date(Date.now() - 172800000), // 2 days ago
    status: 'completed',
    reference: 'FEE-2024-001',
  },

  // María's savings account transactions (acc_004)
  {
    id: 'txn_011',
    accountId: 'acc_004',
    type: 'credit',
    amount: 200.00,
    description: 'Monthly savings transfer',
    category: 'transfer',
    date: new Date(Date.now() - 172800000), // 2 days ago
    status: 'completed',
    reference: 'AUTO-2024-001',
  },
  {
    id: 'txn_012',
    accountId: 'acc_004',
    type: 'credit',
    amount: 87.50,
    description: 'Interest payment',
    category: 'interest',
    date: new Date(Date.now() - 604800000), // 1 week ago
    status: 'completed',
    reference: 'INT-2024-002',
  },

  // Carlos's checking account transactions (acc_005)
  {
    id: 'txn_013',
    accountId: 'acc_005',
    type: 'debit',
    amount: 150.00,
    description: 'Gas station',
    category: 'payment',
    date: new Date(Date.now() - 259200000), // 3 days ago
    status: 'completed',
    reference: 'GAS-2024-001',
  },
  {
    id: 'txn_014',
    accountId: 'acc_005',
    type: 'credit',
    amount: 750.00,
    description: 'Freelance payment',
    category: 'deposit',
    date: new Date(Date.now() - 345600000), // 4 days ago
    status: 'completed',
    reference: 'FREE-2024-001',
  },
  {
    id: 'txn_015',
    accountId: 'acc_005',
    type: 'debit',
    amount: 95.50,
    description: 'Restaurant',
    category: 'payment',
    date: new Date(Date.now() - 432000000), // 5 days ago
    status: 'completed',
    reference: 'REST-2024-001',
  },
];

/**
 * Transaction filter interface
 */
export interface TransactionFilter {
  accountId?: string;
  type?: 'debit' | 'credit' | 'transfer';
  category?: TransactionCategory;
  status?: 'completed' | 'pending' | 'failed';
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

/**
 * Gets transactions for a specific account
 * @param accountId Account ID
 * @param limit Number of transactions to return
 * @param offset Pagination offset
 * @returns Array of transactions
 */
export const getTransactionsByAccountId = (
  accountId: string,
  limit: number = 20,
  offset: number = 0
): Transaction[] => {
  const accountTransactions = mockTransactions
    .filter(transaction => transaction.accountId === accountId)
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
    .slice(offset, offset + limit);

  console.log('📊 Retrieved transactions for account:', JSON.stringify({
    accountId,
    totalTransactions: mockTransactions.filter(t => t.accountId === accountId).length,
    returnedCount: accountTransactions.length,
    limit,
    offset,
  }, null, 2));

  return accountTransactions;
};

/**
 * Gets filtered transactions
 * @param filter Transaction filter criteria
 * @param limit Number of transactions to return
 * @param offset Pagination offset
 * @returns Filtered transactions
 */
export const getFilteredTransactions = (
  filter: TransactionFilter,
  limit: number = 20,
  offset: number = 0
): Transaction[] => {
  let filteredTransactions = [...mockTransactions];

  // Apply filters
  if (filter.accountId) {
    filteredTransactions = filteredTransactions.filter(t => t.accountId === filter.accountId);
  }

  if (filter.type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === filter.type);
  }

  if (filter.category) {
    filteredTransactions = filteredTransactions.filter(t => t.category === filter.category);
  }

  if (filter.status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === filter.status);
  }

  if (filter.startDate) {
    filteredTransactions = filteredTransactions.filter(t => t.date >= filter.startDate!);
  }

  if (filter.endDate) {
    filteredTransactions = filteredTransactions.filter(t => t.date <= filter.endDate!);
  }

  if (filter.minAmount !== undefined) {
    filteredTransactions = filteredTransactions.filter(t => t.amount >= filter.minAmount!);
  }

  if (filter.maxAmount !== undefined) {
    filteredTransactions = filteredTransactions.filter(t => t.amount <= filter.maxAmount!);
  }

  if (filter.description) {
    const searchTerm = filter.description.toLowerCase();
    filteredTransactions = filteredTransactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm)
    );
  }

  // Sort by date (most recent first)
  filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Apply pagination
  const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

  console.log('🔍 Filtered transactions:', JSON.stringify({
    filter,
    totalMatching: filteredTransactions.length,
    returnedCount: paginatedTransactions.length,
    limit,
    offset,
  }, null, 2));

  return paginatedTransactions;
};

/**
 * Gets transaction by ID
 * @param transactionId Transaction ID
 * @returns Transaction or undefined
 */
export const getTransactionById = (transactionId: string): Transaction | undefined => {
  const transaction = mockTransactions.find(t => t.id === transactionId);
  
  if (transaction) {
    console.log('📄 Retrieved transaction by ID:', JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date.toISOString(),
    }, null, 2));
  }
  
  return transaction;
};

/**
 * Creates a new transaction
 * @param transactionData Transaction data
 * @returns Created transaction
 */
export const createTransaction = (transactionData: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction: Transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...transactionData,
  };

  mockTransactions.push(newTransaction);

  console.log('✅ Transaction created:', JSON.stringify({
    id: newTransaction.id,
    accountId: newTransaction.accountId,
    type: newTransaction.type,
    amount: newTransaction.amount,
    description: newTransaction.description,
    status: newTransaction.status,
  }, null, 2));

  return newTransaction;
};

/**
 * Gets recent transactions across all accounts for a user
 * @param accountIds Array of account IDs
 * @param limit Number of transactions to return
 * @returns Recent transactions
 */
export const getRecentTransactions = (accountIds: string[], limit: number = 5): Transaction[] => {
  const recentTransactions = mockTransactions
    .filter(transaction => accountIds.includes(transaction.accountId))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);

  console.log('🕒 Retrieved recent transactions:', JSON.stringify({
    accountIds,
    transactionCount: recentTransactions.length,
    limit,
  }, null, 2));

  return recentTransactions;
};

/**
 * Gets transaction statistics for an account
 * @param accountId Account ID
 * @param startDate Start date for statistics
 * @param endDate End date for statistics
 * @returns Transaction statistics
 */
export const getTransactionStats = (accountId: string, startDate?: Date, endDate?: Date) => {
  let accountTransactions = mockTransactions.filter(t => t.accountId === accountId);

  if (startDate) {
    accountTransactions = accountTransactions.filter(t => t.date >= startDate);
  }

  if (endDate) {
    accountTransactions = accountTransactions.filter(t => t.date <= endDate);
  }

  const stats = {
    totalTransactions: accountTransactions.length,
    totalDebits: accountTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalCredits: accountTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: accountTransactions.filter(t => t.type === 'transfer').length,
    totalDebitCount: accountTransactions.filter(t => t.type === 'debit').length,
    totalCreditCount: accountTransactions.filter(t => t.type === 'credit').length,
    averageTransactionAmount: accountTransactions.length > 0 
      ? accountTransactions.reduce((sum, t) => sum + t.amount, 0) / accountTransactions.length 
      : 0,
  };

  console.log('📈 Transaction statistics:', JSON.stringify({
    accountId,
    period: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
    ...stats,
  }, null, 2));

  return stats;
};

console.log('💳 Mock transactions database initialized with', mockTransactions.length, 'transactions');
