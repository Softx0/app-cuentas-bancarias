import { CommonActions, DrawerActions, StackActions, createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

// TypeScript navigation param list for demo screens
export const DemoNavigationParamList = {};

/**
 * Call this function when you want to navigate to a specific route.
 *
 * @param name The name of the route to navigate to.
 * Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

/**
 * Call this function when you want to navigate to a specific route.
 * This function will add the new route to the navigation history.
 * The user can go back to the previous screen.
 * @param routeName The name of the route to navigate to.
 * Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters
 * @example
 * NavigationService.push('Profile', { userId: '123' });
 */
const push = (routeName, params) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
};

/**
 * Call this function when you want to navigate to a specific route
 * AND reset the navigation history.
 *
 * That means the user cannot go back. This is useful for example to redirect from a splashscreen to
 * the main screen: the user should not be able to go back to the splashscreen.
 *
 * @param routeName The name of the route to navigate to.
 * Routes are defined in RootScreen using createStackNavigator()
 * @param params Route parameters.
 */
const navigateAndReset = (routeName, params) => {
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
  }
};

/**
 * Call this function when you want to navigate to the previous screen
 */
const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

const toggleDrawer = () => {
  navigationRef.isReady() && navigationRef.dispatch(DrawerActions.toggleDrawer());
};

const getParam = ({ route }, param) => route?.params?.[param];

const getAllParams = ({ route }) => route?.params;

const getParams = ({ route }, params) =>
  params.reduce((parameters, param) => {
    parameters[param] = route?.params?.[param];

    return parameters;
  }, {});

const addListenerEvent = (event, callback) => {
  if (navigationRef.isReady()) {
    navigationRef.addListener(event, (e) => {
      callback();
    });
  }
};

const removeListenerEvent = (event, callback) => {
  if (navigationRef.isReady()) {
    navigationRef.removeListener(event, (e) => {
      console.log("removeListenerEvent", e.target);
      callback();
    });
  }
};

/**
 * Navigate to component detail screen
 * @param {string} componentName - Name of the component
 * @param {string} componentType - Type/category of the component
 */
const navigateToComponentDetail = (componentName, componentType) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('ComponentDetail', {
      componentName,
      componentType
    });
  }
};

/**
 * Get current route name
 * @returns {string|null} Current route name or null
 */
const getCurrentRoute = () => {
  if (navigationRef.isReady()) {
    const state = navigationRef.getState();
    const activeRoute = state?.routes[state.index];
    return activeRoute?.name || null;
  }
  return null;
};

/**
 * Check if navigation is ready
 * @returns {boolean} True if navigation is ready
 */
const isReady = () => {
  return navigationRef.isReady();
};

export default {
  push,
  goBack,
  navigate,
  navigateAndReset,
  toggleDrawer,
  getParam,
  getAllParams,
  getParams,
  addListenerEvent,
  removeListenerEvent,
  navigateToComponentDetail,
  getCurrentRoute,
  isReady
};
