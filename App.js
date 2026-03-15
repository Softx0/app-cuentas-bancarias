/**
 * Banking Application - Main Entry Point
 * 
 * This is the main App.js file that serves as the entry point for the banking application.
 * Configured with the main navigation system for the production banking app.
 * Enhanced with error handling and debugging to identify crashes.
 * 
 * @description Main application entry point with error boundaries
 * @version 1.1.0
 * @author Eduardo Valenzuela
 */

import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import main navigator
import RootNavigation from "./src/presentation/navigation/RootNavigation";

// Import root provider
import { RootProvider } from "./src/context/providers/RootProvider";

import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

/**
 * Error Boundary Component for catching JavaScript errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.log('[App] Error caught by ErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('[App] Error details:', error);
    console.log('[App] Error info:', errorInfo);
    this.setState({ error, errorInfo });
    
    // Show alert with error details
    Alert.alert(
      'Application Error',
      `Error: ${error.message}\n\nStack: ${error.stack}`,
      [{ text: 'OK' }]
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>❌ Application Error</Text>
          <Text style={errorStyles.message}>
            The app encountered an error and crashed.
          </Text>
          {this.state.error && (
            <Text style={errorStyles.error}>
              Error: {this.state.error.message}
            </Text>
          )}
          <Text style={errorStyles.instruction}>
            Check the logs for more details.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Main App Component
 * 
 * This component sets up the banking application with enhanced navigation support.
 * The RootNavigation includes tab navigation with Home, Profile, and Settings screens,
 * plus additional stack screens for components demo and examples.
 * Enhanced with error boundaries, TypeScript support, and proper logging.
 * 
 * @returns {React.Element} Main app with navigation and error handling
 */
export default function App() {
  console.log('[App] Starting banking application...');
  
  try {
    console.log('[App] Rendering main components...');
    
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <RootProvider>
            {/* Main Navigation with Tab and Stack Support */}
            <RootNavigation />
            
            {/* Status Bar Configuration for Edge-to-Edge */}
            <StatusBar 
              style="light" 
              backgroundColor="transparent"
              translucent={true}
            />
          </RootProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('[App] Critical error in App component:', error);
    
    return (
      <View style={errorStyles.container}>
        <Text style={errorStyles.title}>❌ Critical Error</Text>
        <Text style={errorStyles.message}>
          The application failed to start.
        </Text>
        <Text style={errorStyles.error}>
          {error.message}
        </Text>
      </View>
    );
  }
}

// Error styles
const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  error: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  instruction: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
