/**
 * @fileoverview Mock account data for banking app simulation
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import type { BankAccount } from '../../../../shared/types';

/**
 * Mock bank accounts database
 */
export const mockAccounts: BankAccount[] = [
  // Eduardo's accounts
  {
    id: 'acc_001',
    userId: 'user_001',
    accountNumber: '4567-8901-2345-6789',
    accountType: 'checking',
    balance: 847500.50,
    currency: 'DOP',
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    lastTransactionDate: new Date(),
  },
  {
    id: 'acc_002',
    userId: 'user_001',
    accountNumber: '4567-8901-2345-6790',
    accountType: 'savings',
    balance: 2436040.25,
    currency: 'DOP',
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    lastTransactionDate: new Date(Date.now() - 86400000), // 1 day ago
  },
  
  // María's accounts
  {
    id: 'acc_003',
    userId: 'user_002',
    accountNumber: '4567-8901-2345-6791',
    accountType: 'checking',
    balance: 482313.50,
    currency: 'DOP',
    isActive: true,
    createdAt: new Date('2024-02-10T14:30:00Z'),
    lastTransactionDate: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: 'acc_004',
    userId: 'user_002',
    accountNumber: '4567-8901-2345-6792',
    accountType: 'savings',
    balance: 1380800.00,
    currency: 'DOP',
    isActive: true,
    createdAt: new Date('2024-02-10T14:30:00Z'),
    lastTransactionDate: new Date(Date.now() - 172800000), // 2 days ago
  },

  // Carlos's accounts
  {
    id: 'acc_005',
    userId: 'user_003',
    accountNumber: '4567-8901-2345-6793',
    accountType: 'checking',
    balance: 184592.30,
    currency: 'DOP',
    isActive: true,
    createdAt: new Date('2024-03-05T09:15:00Z'),
    lastTransactionDate: new Date(Date.now() - 259200000), // 3 days ago
  },
];

/**
 * Gets accounts for a specific user
 * @param userId User ID
 * @returns Array of user's accounts
 */
export const getAccountsByUserId = (userId: string): BankAccount[] => {
  const userAccounts = mockAccounts.filter(account => account.userId === userId && account.isActive);
  
  console.log('🏦 Retrieved accounts for user:', JSON.stringify({
    userId,
    accountCount: userAccounts.length,
    accounts: userAccounts.map(acc => ({
      id: acc.id,
      type: acc.accountType,
      balance: acc.balance,
      accountNumber: `****${acc.accountNumber.slice(-4)}`,
    })),
  }, null, 2));
  
  return userAccounts;
};

/**
 * Gets account by ID
 * @param accountId Account ID
 * @returns Account or undefined
 */
export const getAccountById = (accountId: string): BankAccount | undefined => {
  const account = mockAccounts.find(acc => acc.id === accountId && acc.isActive);
  
  if (account) {
    console.log('🏦 Retrieved account by ID:', JSON.stringify({
      id: account.id,
      type: account.accountType,
      balance: account.balance,
      accountNumber: `****${account.accountNumber.slice(-4)}`,
    }, null, 2));
  }
  
  return account;
};

/**
 * Gets account by account number
 * @param accountNumber Account number
 * @returns Account or undefined
 */
export const getAccountByNumber = (accountNumber: string): BankAccount | undefined => {
  return mockAccounts.find(acc => acc.accountNumber === accountNumber && acc.isActive);
};

/**
 * Updates account balance
 * @param accountId Account ID
 * @param newBalance New balance amount
 * @param updateLastTransaction Whether to update last transaction date
 */
export const updateAccountBalance = (
  accountId: string,
  newBalance: number,
  updateLastTransaction: boolean = true
): void => {
  const account = mockAccounts.find(acc => acc.id === accountId);
  
  if (account) {
    const oldBalance = account.balance;
    account.balance = newBalance;
    
    if (updateLastTransaction) {
      account.lastTransactionDate = new Date();
    }
    
    console.log('💰 Account balance updated:', JSON.stringify({
      accountId: account.id,
      accountNumber: `****${account.accountNumber.slice(-4)}`,
      oldBalance,
      newBalance,
      difference: newBalance - oldBalance,
      lastTransactionDate: account.lastTransactionDate.toISOString(),
    }, null, 2));
  }
};

/**
 * Validates if account belongs to user
 * @param accountId Account ID
 * @param userId User ID
 * @returns True if account belongs to user
 */
export const validateAccountOwnership = (accountId: string, userId: string): boolean => {
  const account = mockAccounts.find(acc => acc.id === accountId);
  return account?.userId === userId && account.isActive;
};

/**
 * Checks if account has sufficient funds
 * @param accountId Account ID
 * @param amount Amount to check
 * @returns True if sufficient funds
 */
export const hasSufficientFunds = (accountId: string, amount: number): boolean => {
  const account = getAccountById(accountId);
  
  if (!account) {
    return false;
  }
  
  const sufficient = account.balance >= amount;
  
  console.log('💳 Checking sufficient funds:', JSON.stringify({
    accountId: account.id,
    accountNumber: `****${account.accountNumber.slice(-4)}`,
    currentBalance: account.balance,
    requestedAmount: amount,
    sufficient,
  }, null, 2));
  
  return sufficient;
};

/**
 * Gets total balance across all user accounts
 * @param userId User ID
 * @returns Total balance
 */
export const getTotalBalance = (userId: string): number => {
  const userAccounts = getAccountsByUserId(userId);
  const total = userAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  console.log('📊 Total balance calculated:', JSON.stringify({
    userId,
    accountCount: userAccounts.length,
    totalBalance: total,
  }, null, 2));
  
  return total;
};

/**
 * Formats account number for display (masks sensitive digits)
 * @param accountNumber Full account number
 * @returns Masked account number
 */
export const formatAccountNumber = (accountNumber: string): string => {
  if (accountNumber.length < 4) {
    return '*'.repeat(accountNumber.length);
  }
  
  const lastFour = accountNumber.slice(-4);
  const masked = '*'.repeat(accountNumber.length - 4);
  return `${masked}${lastFour}`;
};

/**
 * Validates account number format
 * @param accountNumber Account number to validate
 * @returns True if valid format
 */
export const isValidAccountNumber = (accountNumber: string): boolean => {
  // Simple validation: should be in format XXXX-XXXX-XXXX-XXXX
  const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
  return pattern.test(accountNumber);
};

console.log('🏦 Mock accounts database initialized with', mockAccounts.length, 'accounts');
