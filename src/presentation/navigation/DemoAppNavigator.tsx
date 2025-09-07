/**
 * Demo App Navigator - Banking Application
 * 
 * Navigation configuration that sets the ComponentsDemo screen as the main entry point.
 * This navigator is designed for testing and validating components during development.
 * Integrates with NavigationService for programmatic navigation.
 * 
 * @description Demo navigation setup with ComponentsDemo as main screen
 * @version 2.0.0
 * @author Eduardo Valenzuela
 */

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

// Import theme
import Colors from "../../../themes/Colors";

// Import navigation service with types (using TypeScript version)
import {
  DemoNavigationParamList,
  navigationRef
} from "../../infrastructure/services/NavigationService";

// Import demo screens
import ComponentDetailScreen from "../screens/demo/ComponentDetailScreen";
import ComponentsDemo from "../screens/demo/ComponentsDemo";

const Stack = createNativeStackNavigator<DemoNavigationParamList>();

/**
 * Demo App Navigator Component
 * 
 * This navigator sets up the ComponentsDemo screen as the main entry point
 * for testing and validating all banking application components.
 * Integrates with the TypeScript NavigationService for type-safe navigation.
 * 
 * @returns {React.ReactElement} Navigation container with demo screen
 */
const DemoAppNavigator = (): React.ReactElement => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="ComponentsDemo"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary[300],
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerTitleAlign: "center",
          // Enable gesture handling
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Screen
          name="ComponentsDemo"
          component={ComponentsDemo}
          options={{
            title: "🏦 Banking Components Demo",
            headerShown: true,
            // Disable back gesture since this is the root screen
            gestureEnabled: false,
          }}
        />
        
        <Stack.Screen
          name="ComponentDetail"
          component={ComponentDetailScreen}
          options={({ route }: { route: NativeStackScreenProps<DemoNavigationParamList, 'ComponentDetail'>['route'] }) => ({
            title: `${route.params?.componentName || 'Component'} Details`,
            headerBackTitle: "Back",
            gestureEnabled: true,
          })}
        />
        
        {/* Add more screens here as needed */}
        {/*
        <Stack.Screen
          name="OtherScreen"
          component={OtherScreen}
          options={{
            title: "Other Screen",
            headerBackTitle: "Back",
          }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DemoAppNavigator;
