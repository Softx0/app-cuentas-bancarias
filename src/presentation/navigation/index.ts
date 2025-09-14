/**
 * Navigation Barrel Export - Banking Application
 * 
 * Centralized exports for navigation components and services.
 * Provides clean imports and better tree shaking.
 * 
 * @description Navigation barrel exports
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

// Main navigation component
export { default as RootNavigation } from './RootNavigation';

// Navigation service
export { navigationRef, default as NavigationService } from '../../infrastructure/services/NavigationService';

// Route configurations
export { STACK_NAVIGATOR_OPTIONS, default as STACK_ROUTES } from '../routes/StackRoutes';
export { TAB_NAVIGATOR_OPTIONS, default as TAB_ROUTES } from '../routes/TabRoutes';

// Type definitions
export type {
    HomeScreenProps, NavigationState, ProfileScreenProps, RootStackNavigationProp, RootStackParamList, RootStackRouteProp, Route, StackRouteConfig, TabIconProps, TabNavigationProp, TabParamList, TabRouteConfig, TabRouteProp
} from '../../../types/navigation';

/**
 * Usage Examples:
 * 
 * // Import main navigation
 * import { RootNavigation } from '@/presentation/navigation';
 * 
 * // Import navigation service
 * import { NavigationService } from '@/presentation/navigation';
 * 
 * // Import types
 * import type { HomeScreenProps } from '@/presentation/navigation';
 * 
 * // Import route configurations
 * import { TAB_ROUTES, STACK_ROUTES } from '@/presentation/navigation';
 */
