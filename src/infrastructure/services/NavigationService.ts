/**
 * Navigation Service - Banking Application
 * 
 * Centralized navigation service that provides programmatic navigation capabilities
 * throughout the application without needing to pass navigation props.
 * 
 * @description TypeScript navigation service for programmatic navigation
 * @version 2.0.0
 * @author Eduardo Valenzuela
 */

import {
  CommonActions,
  createNavigationContainerRef,
  DrawerActions,
  ParamListBase,
  RouteProp,
  StackActions
} from "@react-navigation/native";

// ========================================================================================
// TYPES AND INTERFACES
// ========================================================================================

/**
 * Navigation parameters for demo screens
 */
export interface DemoNavigationParamList extends ParamListBase {
  ComponentsDemo: undefined;
  ComponentDetail: {
    componentName: string;
    componentType: string;
  };
  // Add more screen parameters as needed
}

/**
 * Navigation service interface
 */
export interface NavigationServiceInterface {
  navigate: (name: keyof DemoNavigationParamList, params?: any) => void;
  push: (routeName: keyof DemoNavigationParamList, params?: any) => void;
  navigateAndReset: (routeName: keyof DemoNavigationParamList, params?: any) => void;
  goBack: () => void;
  toggleDrawer: () => void;
  getParam: (route: RouteProp<DemoNavigationParamList>, param: string) => any;
  getAllParams: (route: RouteProp<DemoNavigationParamList>) => any;
  getParams: (route: RouteProp<DemoNavigationParamList>, params: string[]) => Record<string, any>;
  addListenerEvent: (event: string, callback: () => void) => void;
  removeListenerEvent: (event: string, callback: () => void) => void;
  isReady: () => boolean;
  getCurrentRoute: () => string | undefined;
}

/**
 * Event listener callback type
 */
type NavigationEventCallback = () => void;

// ========================================================================================
// NAVIGATION REF
// ========================================================================================

/**
 * Navigation container reference for programmatic navigation
 */
export const navigationRef = createNavigationContainerRef<DemoNavigationParamList>();

// ========================================================================================
// NAVIGATION FUNCTIONS
// ========================================================================================

/**
 * Navigate to a specific route
 * 
 * @param name - The name of the route to navigate to
 * @param params - Route parameters
 * 
 * @example
 * NavigationService.navigate('ComponentsDemo');
 * NavigationService.navigate('ComponentDetail', { componentName: 'Button' });
 */
const navigate = (name: keyof DemoNavigationParamList, params?: any): void => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Push a new route to the navigation stack
 * This function will add the new route to the navigation history.
 * The user can go back to the previous screen.
 * 
 * @param routeName - The name of the route to navigate to
 * @param params - Route parameters
 * 
 * @example
 * NavigationService.push('ComponentDetail', { componentName: 'Input' });
 */
const push = (routeName: keyof DemoNavigationParamList, params?: any): void => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Navigate to a specific route and reset the navigation history
 * 
 * This means the user cannot go back. This is useful for example to redirect 
 * from a splashscreen to the main screen: the user should not be able to go 
 * back to the splashscreen.
 * 
 * @param routeName - The name of the route to navigate to
 * @param params - Route parameters
 * 
 * @example
 * NavigationService.navigateAndReset('ComponentsDemo');
 */
const navigateAndReset = (routeName: keyof DemoNavigationParamList, params?: any): void => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params
          }
        ]
      })
    );
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Navigate to the previous screen
 * 
 * @example
 * NavigationService.goBack();
 */
const goBack = (): void => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Toggle drawer (if using drawer navigator)
 * 
 * @example
 * NavigationService.toggleDrawer();
 */
const toggleDrawer = (): void => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.toggleDrawer());
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Get a specific parameter from the route
 * 
 * @param route - The route object
 * @param param - The parameter name to retrieve
 * @returns The parameter value or undefined
 * 
 * @example
 * const componentName = NavigationService.getParam(route, 'componentName');
 */
const getParam = (route: RouteProp<DemoNavigationParamList>, param: string): any => {
  return route?.params?.[param];
};

/**
 * Get all parameters from the route
 * 
 * @param route - The route object
 * @returns All route parameters
 * 
 * @example
 * const allParams = NavigationService.getAllParams(route);
 */
const getAllParams = (route: RouteProp<DemoNavigationParamList>): any => {
  return route?.params;
};

/**
 * Get specific parameters from the route
 * 
 * @param route - The route object
 * @param params - Array of parameter names to retrieve
 * @returns Object with requested parameters
 * 
 * @example
 * const params = NavigationService.getParams(route, ['componentName', 'componentType']);
 */
const getParams = (route: RouteProp<DemoNavigationParamList>, params: string[]): Record<string, any> => {
  return params.reduce((parameters: Record<string, any>, param: string) => {
    parameters[param] = route?.params?.[param];
    return parameters;
  }, {});
};

/**
 * Add event listener for navigation events
 * 
 * @param event - The event name
 * @param callback - The callback function
 * 
 * @example
 * NavigationService.addListenerEvent('focus', () => {
 *   console.log('Screen focused');
 * });
 */
const addListenerEvent = (event: string, callback: NavigationEventCallback): void => {
  if (navigationRef.isReady()) {
    navigationRef.addListener(event as any, (e) => {
      callback();
    });
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Remove event listener for navigation events
 * 
 * @param event - The event name
 * @param callback - The callback function
 * 
 * @example
 * NavigationService.removeListenerEvent('focus', myCallback);
 */
const removeListenerEvent = (event: string, callback: NavigationEventCallback): void => {
  if (navigationRef.isReady()) {
    navigationRef.removeListener(event as any, (e) => {
      console.log('removeListenerEvent', e.target);
      callback();
    });
  } else {
    console.warn('NavigationService: Navigation container is not ready');
  }
};

/**
 * Check if navigation container is ready
 * 
 * @returns True if navigation container is ready
 * 
 * @example
 * if (NavigationService.isReady()) {
 *   NavigationService.navigate('ComponentsDemo');
 * }
 */
const isReady = (): boolean => {
  return navigationRef.isReady();
};

/**
 * Get the current route name
 * 
 * @returns Current route name or undefined
 * 
 * @example
 * const currentRoute = NavigationService.getCurrentRoute();
 */
const getCurrentRoute = (): string | undefined => {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return undefined;
};

// ========================================================================================
// DEMO-SPECIFIC NAVIGATION FUNCTIONS
// ========================================================================================

/**
 * Navigate to component detail screen
 * 
 * @param componentName - Name of the component
 * @param componentType - Type/category of the component
 * 
 * @example
 * NavigationService.navigateToComponentDetail('ReusableButton', 'Button Components');
 */
const navigateToComponentDetail = (componentName: string, componentType: string): void => {
  navigate('ComponentDetail', { componentName, componentType });
};

/**
 * Navigate back to components demo screen
 * 
 * @example
 * NavigationService.navigateToComponentsDemo();
 */
const navigateToComponentsDemo = (): void => {
  navigate('ComponentsDemo');
};

/**
 * Reset navigation to components demo screen
 * 
 * @example
 * NavigationService.resetToComponentsDemo();
 */
const resetToComponentsDemo = (): void => {
  navigateAndReset('ComponentsDemo');
};

// ========================================================================================
// NAVIGATION SERVICE EXPORT
// ========================================================================================

/**
 * Navigation Service - Complete programmatic navigation solution
 * 
 * This service provides all necessary navigation functions that can be called
 * from anywhere in the application without needing navigation props.
 */
const NavigationService: NavigationServiceInterface & {
  navigateToComponentDetail: typeof navigateToComponentDetail;
  navigateToComponentsDemo: typeof navigateToComponentsDemo;
  resetToComponentsDemo: typeof resetToComponentsDemo;
  getCurrentRoute: typeof getCurrentRoute;
} = {
  // Core navigation functions
  navigate,
  push,
  goBack,
  navigateAndReset,
  toggleDrawer,
  
  // Parameter functions
  getParam,
  getAllParams,
  getParams,
  
  // Event listener functions
  addListenerEvent,
  removeListenerEvent,
  
  // Utility functions
  isReady,
  getCurrentRoute,
  
  // Demo-specific functions
  navigateToComponentDetail,
  navigateToComponentsDemo,
  resetToComponentsDemo
};

export default NavigationService;

// ========================================================================================
// USAGE EXAMPLES AND DOCUMENTATION
// ========================================================================================

/**
 * USAGE EXAMPLES:
 * 
 * 1. Basic Navigation:
 *    NavigationService.navigate('ComponentsDemo');
 * 
 * 2. Navigation with Parameters:
 *    NavigationService.navigate('ComponentDetail', { 
 *      componentName: 'ReusableButton',
 *      componentType: 'Button Components'
 *    });
 * 
 * 3. Push to Stack:
 *    NavigationService.push('ComponentDetail', { componentName: 'Input' });
 * 
 * 4. Go Back:
 *    NavigationService.goBack();
 * 
 * 5. Reset Navigation:
 *    NavigationService.navigateAndReset('ComponentsDemo');
 * 
 * 6. Get Route Parameters:
 *    const params = NavigationService.getAllParams(route);
 *    const componentName = NavigationService.getParam(route, 'componentName');
 * 
 * 7. Event Listeners:
 *    NavigationService.addListenerEvent('focus', () => {
 *      console.log('Screen focused');
 *    });
 * 
 * 8. Demo-specific:
 *    NavigationService.navigateToComponentDetail('Button', 'Button Components');
 *    NavigationService.resetToComponentsDemo();
 */
