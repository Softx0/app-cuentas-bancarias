/**
 * Tab Routes Configuration - Banking Application
 * 
 * Centralized configuration for bottom tab navigation routes.
 * Provides easy management of tab screens with icons, titles, and options.
 * 
 * @description Tab navigation route configuration
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

import React from 'react';
import { Text } from 'react-native';

// Import types
import { TabIconProps, TabRouteConfig } from '../../../types/navigation';

// Import theme
import Colors from '../../../themes/Colors';

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

/**
 * Tab Icon Component
 * 
 * Renders appropriate icon based on route name and focus state.
 * Uses consistent emoji icons - focused state changes opacity only for better UX.
 */
const TabIcon: React.FC<{ route: string } & TabIconProps> = ({ route, focused, color, size }) => {
  const getIcon = () => {
    switch (route) {
      case 'Home':
        return '🏠';
      case 'Profile':
        return '👤';
      default:
        return '📱';
    }
  };

  return (
    <Text style={{ 
      fontSize: size - 2, 
      opacity: focused ? 1 : 0.6,
      transform: focused ? [{ scale: 1.1 }] : [{ scale: 1.0 }]
    }}>
      {getIcon()}
    </Text>
  );
};

/**
 * Tab Routes Configuration Array
 * 
 * Centralized configuration for all tab navigation routes.
 * Easy to add, remove, or modify tab screens.
 */
const TAB_ROUTES: TabRouteConfig[] = [
  {
    name: 'Home',
    component: HomeScreen,
    options: {
      title: 'Inicio',
      tabBarLabel: 'Inicio',
      tabBarIcon: ({ focused, color, size }: TabIconProps) => (
        <TabIcon route="Home" focused={focused} color={color} size={size} />
      ),
    },
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    options: {
      title: 'Perfil',
      tabBarLabel: 'Perfil',
      tabBarIcon: ({ focused, color, size }: TabIconProps) => (
        <TabIcon route="Profile" focused={focused} color={color} size={size} />
      ),
    },
  },
];

/**
 * Tab Navigator Options
 * 
 * Global options for the tab navigator styling and behavior.
 */
export const TAB_NAVIGATOR_OPTIONS = {
  screenOptions: {
    // Header options
    headerShown: false,
    
    // Tab bar styling
    tabBarStyle: {
      backgroundColor: Colors.white,
      borderTopColor: Colors.border,
      borderTopWidth: 1,
      paddingBottom: 20, // Increased padding for better spacing from bottom
      paddingTop: 8,
      height: 82, // Increased height to accommodate more padding
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    
    // Tab bar item styling
    tabBarActiveTintColor: Colors.primary[300],
    tabBarInactiveTintColor: Colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 500 as const,
      marginTop: 4,
    },
    
    // Tab bar behavior
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: true,
  },
  
  // Initial route
  initialRouteName: 'Home' as const,
};

/**
 * Helper function to get tab route by name
 */
export const getTabRouteByName = (name: string): TabRouteConfig | undefined => {
  return TAB_ROUTES.find(route => route.name === name);
};

/**
 * Helper function to get all tab route names
 */
export const getTabRouteNames = (): string[] => {
  return TAB_ROUTES.map(route => route.name);
};

/**
 * Log tab routes for debugging
 */
console.log('📱 [TabRoutes] Configured tab routes:', {
  routes: getTabRouteNames(),
  count: TAB_ROUTES.length,
  initialRoute: TAB_NAVIGATOR_OPTIONS.initialRouteName,
});

export default TAB_ROUTES;
