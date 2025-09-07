/**
 * Navigation Demo Types
 * 
 * Defines navigation parameter types for demo screens
 * with proper TypeScript support for React Navigation
 * 
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { ComponentCategory } from './ComponentDemo.types';

/**
 * Demo navigation parameter list  
 * Defines the parameter structure for each screen in the demo navigator
 */
export type DemoNavigationParamList = {
  /**
   * Main components demo screen
   * No parameters required
   */
  ComponentsDemo: undefined;
  
  /**
   * Component detail screen
   * Shows detailed information about a specific component
   */
  ComponentDetail: {
    /** Name of the component to display */
    componentName: string;
    /** Category the component belongs to */
    componentType: string;
    /** Component category for organization */
    category?: ComponentCategory;
    /** Optional additional data */
    additionalData?: Record<string, unknown>;
  };
} & import('@react-navigation/native').ParamListBase;

/**
 * Navigation screen names as constants for type safety
 */
export const DEMO_SCREEN_NAMES = {
  COMPONENTS_DEMO: 'ComponentsDemo' as keyof DemoNavigationParamList,
  COMPONENT_DETAIL: 'ComponentDetail' as keyof DemoNavigationParamList
} as const;

/**
 * Navigation route props helper types
 */
export type ComponentsDemoScreenProps = {
  route: {
    params: DemoNavigationParamList['ComponentsDemo'];
  };
  navigation: any; // Will be properly typed with navigation object
};

export type ComponentDetailScreenProps = {
  route: {
    params: DemoNavigationParamList['ComponentDetail'];
  };
  navigation: any; // Will be properly typed with navigation object
};
