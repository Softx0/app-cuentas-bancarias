/**
 * Enhanced Navigation Service - Banking Application
 * 
 * Provides type-safe, error-handled navigation utilities with comprehensive logging.
 * Supports programmatic navigation across the entire application with fallback mechanisms.
 * 
 * @description Type-safe navigation service with error handling and logging
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

import {
  CommonActions,
  createNavigationContainerRef,
  StackActions
} from "@react-navigation/native";
import type { RootStackParamList } from '../../../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Enhanced navigation with error handling and comprehensive logging
 */
const navigate = <T extends keyof RootStackParamList>(
  name: T, 
  params?: RootStackParamList[T]
): void => {
  console.log(`🧭 [NavigationService] Navigating to: ${String(name)}`, 
    params ? JSON.stringify(params, null, 2) : "no params"
  );

  if (navigationRef.isReady()) {
    try {
      navigationRef.navigate(name as any, params as any);
    } catch (error) {
      console.error(`❌ [NavigationService] Navigation error to ${String(name)}:`, error);
    }
  } else {
    console.warn(`⚠️ [NavigationService] Navigation not ready for: ${String(name)}`);
  }
};

/**
 * Enhanced goBack with safety checks and fallback
 */
const goBack = (): void => {
  console.log("🔙 [NavigationService] Going back");

  if (navigationRef.isReady()) {
    try {
      const canGoBack = navigationRef.canGoBack();

      if (canGoBack) {
        navigationRef.goBack();
      } else {
        console.warn("⚠️ [NavigationService] Cannot go back - navigating to TabMenu");
        navigateAndReset("TabMenu");
      }
    } catch (error) {
      console.error("❌ [NavigationService] GoBack error:", error);
      // Fallback to safe navigation
      navigateAndReset("TabMenu");
    }
  }
};

/**
 * Push a new screen onto the stack
 */
const push = <T extends keyof RootStackParamList>(
  routeName: T, 
  params?: RootStackParamList[T]
): void => {
  console.log(`📤 [NavigationService] Pushing: ${String(routeName)}`);
  
  if (navigationRef.isReady()) {
    try {
      navigationRef.dispatch(StackActions.push(routeName as string, params));
    } catch (error) {
      console.error(`❌ [NavigationService] Push error:`, error);
    }
  }
};

/**
 * Reset navigation stack to specific route
 */
const navigateAndReset = <T extends keyof RootStackParamList>(
  routeName: T, 
  params?: RootStackParamList[T]
): void => {
  console.log(`🔄 [NavigationService] Resetting to: ${String(routeName)}`);
  
  if (navigationRef.isReady()) {
    try {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName as string, params }]
        })
      );
    } catch (error) {
      console.error(`❌ [NavigationService] Reset error:`, error);
    }
  }
};

/**
 * Get current route name safely
 */
const getCurrentRouteName = (): string | undefined => {
  try {
    return navigationRef.getCurrentRoute()?.name;
  } catch (error) {
    console.error("❌ [NavigationService] Error getting current route:", error);
    return undefined;
  }
};

/**
 * Get current route params safely
 */
const getCurrentRouteParams = (): any => {
  try {
    return navigationRef.getCurrentRoute()?.params;
  } catch (error) {
    console.error("❌ [NavigationService] Error getting current route params:", error);
    return undefined;
  }
};

// Parameter utilities with type safety
const getParam = <T extends keyof RootStackParamList>(
  route: { params?: RootStackParamList[T] }, 
  param: keyof RootStackParamList[T]
): any => {
  try {
    return (route?.params as any)?.[param];
  } catch (error) {
    console.error("❌ [NavigationService] Error getting param:", error);
    return undefined;
  }
};

const getAllParams = <T extends keyof RootStackParamList>(
  route: { params?: RootStackParamList[T] }
): RootStackParamList[T] | undefined => {
  try {
    return route?.params;
  } catch (error) {
    console.error("❌ [NavigationService] Error getting all params:", error);
    return undefined;
  }
};

// Event listeners with proper cleanup
const addListenerEvent = (event: string, callback: () => void): (() => void) => {
  try {
    const unsubscribe = navigationRef.addListener(event as any, () => {
      callback();
    });
    return unsubscribe;
  } catch (error) {
    console.error("❌ [NavigationService] Error adding listener:", error);
    return () => {}; // Return empty cleanup function
  }
};

/**
 * Navigation readiness check
 */
const isReady = (): boolean => {
  return navigationRef.isReady();
};

/**
 * Get navigation state for debugging
 */
const getNavigationState = (): any => {
  try {
    return navigationRef.getState();
  } catch (error) {
    console.error("❌ [NavigationService] Error getting navigation state:", error);
    return null;
  }
};

export default {
  // Core navigation methods
  push,
  goBack,
  navigate,
  navigateAndReset,
  
  // Utility methods
  getCurrentRouteName,
  getCurrentRouteParams,
  getParam,
  getAllParams,
  addListenerEvent,
  isReady,
  getNavigationState,
  
  // Navigation reference for direct access
  navigationRef,
};