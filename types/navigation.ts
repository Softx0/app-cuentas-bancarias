/**
 * Navigation Type Definitions - Banking Application
 * 
 * Comprehensive type definitions for all navigation stacks and parameters.
 * Provides type safety across the entire navigation system.
 * 
 * @description Type-safe navigation definitions
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack Parameter List - Main application navigation
export type RootStackParamList = {
  // Tab Navigator
  TabMenu: undefined;
  
  // Tab Screens
  Home: undefined;
  Profile: undefined;
  
  // Authentication Screens
  Login: undefined;
  Register: undefined;
  
  // Banking Screens
  AccountList: undefined;
  AccountDetail: { 
    accountId: string;
    accountName?: string;
  };
  TransactionHistory: { 
    accountId?: string;
    filters?: any;
  };
  Transfer: { 
    fromAccountId?: string;
    toAccountId?: string;
  };
  TransferResult: { 
    transactionId: string;
    success?: boolean;
  };
  BalanceInquiry: { 
    accountId?: string;
  };
  
  
};

// Tab Navigator Parameter List - Bottom tab navigation
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Navigation prop types for screens
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

export type TabNavigationProp<T extends keyof TabParamList> = 
  BottomTabNavigationProp<TabParamList, T>;

// Route prop types for screens
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

export type TabRouteProp<T extends keyof TabParamList> = 
  RouteProp<TabParamList, T>;

// Screen prop combinations for convenience
export interface HomeScreenProps {
  navigation: TabNavigationProp<'Home'>;
  route: TabRouteProp<'Home'>;
}

export interface ProfileScreenProps {
  navigation: TabNavigationProp<'Profile'>;
  route: TabRouteProp<'Profile'>;
}




// Banking Screen Props
export interface LoginScreenProps {
  navigation: RootStackNavigationProp<'Login'>;
  route: RootStackRouteProp<'Login'>;
}

export interface RegisterScreenProps {
  navigation: RootStackNavigationProp<'Register'>;
  route: RootStackRouteProp<'Register'>;
}

export interface AccountListScreenProps {
  navigation: RootStackNavigationProp<'AccountList'>;
  route: RootStackRouteProp<'AccountList'>;
}

export interface AccountDetailScreenProps {
  navigation: RootStackNavigationProp<'AccountDetail'>;
  route: RootStackRouteProp<'AccountDetail'>;
}

export interface TransactionHistoryScreenProps {
  navigation: RootStackNavigationProp<'TransactionHistory'>;
  route: RootStackRouteProp<'TransactionHistory'>;
}

export interface TransferScreenProps {
  navigation: RootStackNavigationProp<'Transfer'>;
  route: RootStackRouteProp<'Transfer'>;
}

export interface TransferResultScreenProps {
  navigation: RootStackNavigationProp<'TransferResult'>;
  route: RootStackRouteProp<'TransferResult'>;
}

export interface BalanceInquiryScreenProps {
  navigation: RootStackNavigationProp<'BalanceInquiry'>;
  route: RootStackRouteProp<'BalanceInquiry'>;
}

// Navigation state types
export interface NavigationState {
  key: string;
  index: number;
  routeNames: string[];
  routes: Route[];
  type: string;
  stale: boolean;
}

export interface Route {
  key: string;
  name: string;
  params?: any;
  path?: string;
}

// Icon props for tab navigation
export interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

// Route configuration types
export interface TabRouteConfig {
  name: keyof TabParamList;
  component: React.ComponentType<any>;
  options: {
    title: string;
    tabBarIcon: (props: TabIconProps) => React.ReactNode;
    tabBarLabel?: string;
  };
}

export interface StackRouteConfig {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  options?: {
    title?: string;
    headerShown?: boolean;
    headerBackTitle?: string;
    gestureEnabled?: boolean;
    [key: string]: any;
  };
}
