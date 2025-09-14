/**
 * Screens Barrel Export - Banking Application
 * 
 * Centralized exports for all screen components.
 * Organized by feature groups for better maintainability.
 * 
 * @description Screens barrel exports
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

// Main Tab Screens
export { default as HomeScreen } from './home/HomeScreen';
export { default as ProfileScreen } from './profile/ProfileScreen';

// Authentication Screens
export { LoginScreen } from './auth/LoginScreen';
export { RegisterScreen } from './auth/RegisterScreen';

// Banking Screens
export { AccountDetailScreen } from './banking/AccountDetailScreen';
export { AccountListScreen } from './banking/AccountListScreen';
export { BalanceInquiryScreen } from './banking/BalanceInquiryScreen';
export { TransactionHistoryScreen } from './banking/TransactionHistoryScreen';
export { TransferResultScreen } from './banking/TransferResultScreen';
export { TransferScreen } from './banking/TransferScreen';



/**
 * Usage Examples:
 * 
 * // Import main screens
 * import { HomeScreen, ProfileScreen, SettingsScreen } from '@/presentation/screens';
 * 
 * // Import banking screens
 * import { AccountListScreen, TransferScreen } from '@/presentation/screens';
 *
 * import { ExampleScreen1, ExampleScreen2, ExampleScreen3 } from '@/presentation/screens';
 */
