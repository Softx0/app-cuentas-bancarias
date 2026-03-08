/**
 * Root Navigation - Banking Application
 * 
 * Main navigation component that combines Tab and Stack navigators.
 * Implements best practices from the navigation architecture guide.
 * Provides type-safe navigation with proper error handling and logging.
 * 
 * @description Main navigation container with tab and stack navigation
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';

// Import types
import { RootStackParamList, TabParamList } from '../../../types/navigation';

// Import theme

// Import contexts
import { useAuth } from '../../context/auth/AuthContext';

// Import screens
import { LoginScreen, RegisterScreen } from '../screens/auth';

// Import navigation service
import { navigationRef } from '../../infrastructure/services/NavigationService';

// Import route configurations
import STACK_ROUTES, { STACK_NAVIGATOR_OPTIONS } from '../routes/StackRoutes';
import TAB_ROUTES, { TAB_NAVIGATOR_OPTIONS } from '../routes/TabRoutes';

// Create navigators with proper typing
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Authentication Stack Navigator
 * 
 * Stack navigator for login and registration screens.
 */
const AuthStack: React.FC = () => {
  console.log(' [AuthStack] Component rendered');

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Tab Navigation Component
 * 
 * Bottom tab navigator with all main app sections.
 * Configured with routes from TabRoutes configuration.
 */
const TabNavigation: React.FC = () => {
  console.log(' [TabNavigation] Component rendered');

  return (
    <Tab.Navigator
      initialRouteName={TAB_NAVIGATOR_OPTIONS.initialRouteName}
      screenOptions={TAB_NAVIGATOR_OPTIONS.screenOptions}
    >
      {TAB_ROUTES.map((route, index) => (
        <Tab.Screen 
          key={`tab_route_${route.name}_${index}`}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Tab.Navigator>
  );
};

/**
 * App Stack Navigator
 * 
 * Main app stack with tabs and additional screens.
 */
const AppStack: React.FC = () => {
  console.log(' [AppStack] Component rendered');

  return (
    <Stack.Navigator
      initialRouteName={STACK_NAVIGATOR_OPTIONS.initialRouteName}
      screenOptions={STACK_NAVIGATOR_OPTIONS.screenOptions}
    >
      {/* Main Tab Menu Screen */}
      <Stack.Screen
        name="TabMenu"
        component={TabNavigation}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable back gesture for main screen
        }}
      />

      {/* Additional Stack Screens */}
      {STACK_ROUTES.map((route, index) => (
        <Stack.Screen
          key={`stack_route_${route.name}_${index}`}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};

/**
 * Main Root Navigation Component
 * 
 * Root navigation with conditional routing based on authentication state.
 * Shows AuthStack when not authenticated, AppStack when authenticated.
 */
const RootNavigation: React.FC = () => {
  console.log(' [RootNavigation] Component rendered');

  // Get authentication state
  const { isAuthenticated, isLoading } = useAuth();

  // Navigation ready handler
  const handleNavigationReady = useCallback(() => {
    console.log(' [RootNavigation] Navigation is ready', { isAuthenticated, isLoading });
    
    // Log initial navigation state for debugging
    if (__DEV__) {
      const state = navigationRef.getState();
      console.log(' [RootNavigation] Initial state:', JSON.stringify(state, null, 2));
    }
  }, [isAuthenticated, isLoading]);

  // Navigation state change handler for debugging
  const handleNavigationStateChange = useCallback((state: any) => {
    if (__DEV__) {
      console.log(' [RootNavigation] State changed:', {
        routeName: navigationRef.getCurrentRoute()?.name,
        params: navigationRef.getCurrentRoute()?.params,
        isAuthenticated,
        timestamp: new Date().toISOString(),
      });
    }
  }, [isAuthenticated]);

  // Show loading screen while checking auth state
  if (isLoading) {
    console.log(' [RootNavigation] Auth loading...');
    return null; // Or a loading screen component
  }

  console.log(' [RootNavigation] Rendering navigation', { isAuthenticated });

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}
    >
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

/**
 * Navigation Configuration Summary
 * 
 * Log the complete navigation structure for debugging and documentation.
 */
if (__DEV__) {
  console.log(' [RootNavigation] Navigation Structure:', {
    authScreens: ['Login', 'Register'],
    tabRoutes: TAB_ROUTES.map(route => route.name),
    stackRoutes: STACK_ROUTES.map(route => route.name),
    totalScreens: TAB_ROUTES.length + STACK_ROUTES.length + 3, // +3 for TabMenu, Login, Register
    navigationService: 'Enhanced with conditional auth routing',
    authIntegration: 'Full AuthContext integration',
    typeSupport: 'Full TypeScript support',
    performance: 'Optimized with useCallback and proper cleanup',
  });
}

export default RootNavigation;
