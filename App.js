/**
 * Banking Application - Main Entry Point
 * 
 * This is the main App.js file that serves as the entry point for the banking application.
 * Currently configured with ComponentsDemo as the main screen for development and testing.
 * 
 * @description Main application entry point
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import { StatusBar } from "expo-status-bar";
import React from "react";

// Import main navigator
import DemoAppNavigator from "./src/presentation/navigation/DemoAppNavigator";

/**
 * Main App Component
 * 
 * This component sets up the banking application with navigation support.
 * The DemoAppNavigator includes ComponentsDemo as the main screen and
 * provides a foundation for adding more screens in the future.
 * 
 * @returns {React.Element} Main app with navigation
 */
export default function App() {
  return (
    <>
      {/* Main Navigation */}
      <DemoAppNavigator />
      
      {/* Status Bar Configuration */}
      <StatusBar 
        style="light" 
        backgroundColor="#1E5AA8" 
        translucent={false}
      />
    </>
  );
}
