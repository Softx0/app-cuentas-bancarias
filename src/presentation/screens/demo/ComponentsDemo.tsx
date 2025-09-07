/**
 * Components Demo Screen - Banking Application
 * 
 * Comprehensive testing and validation environment for all reusable components
 * in the banking application. Showcases proper usage, different states,
 * and styling options for each component following clean architecture.
 * 
 * @description Main demo screen for component testing with TypeScript
 * @version 2.0.0
 * @author Eduardo Valenzuela
 */

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import theme and utilities
import Colors from "../../../../themes/Colors";
import { FontSize } from "../../../../themes/Fonts";
import Metrics from "../../../../themes/Metrics";

// Import types and data
import { DemoState } from "./types/ComponentDemo.types";

// Import reusable components (organized by category)
// Button Components - TEMPORARILY SIMPLIFIED FOR DEBUGGING
import ReusableButton from "../../../../components/custom-button/ReusableButton";

// Expo Components
import { HelloWave } from "../../../../components/HelloWave";
import { ThemedText } from "../../../../components/ThemedText";

// Error Boundary
import ErrorBoundary from "../../../../components/ErrorBoundary";

console.log('[ComponentsDemo] Starting TypeScript component imports...');

/**
 * Main ComponentsDemo component with comprehensive component showcase
 * Implements clean architecture and performance optimizations
 */
const ComponentsDemo: React.FC = () => {
  console.log('[ComponentsDemo] Initializing ComponentsDemo with TypeScript...');

  // Simplified for debugging - calendar hook removed temporarily

  // Simplified component state for debugging
  const [demoState, setDemoState] = useState<DemoState>({
    // Minimal state for testing
    textInputValue: '',
    searchValue: '',
    checkboxStates: {},
    radioValue: '',
    doubleRadioLeft: false,
    doubleRadioRight: false,
    selectedDropdownValue: null,
    selectedCountry: null,
    selectedMultipleValues: [],
    selectedDate: null,
    selectedDateRange: { startDate: '', endDate: '' },
    showLoading: false,
    showSnackbar: false,
    showError: false,
    showNoResults: false,
    selectedTab: 'home',
    currentStep: 1,
    showConditionalContent: true
  });

  console.log('[ComponentsDemo] Starting render with state:', JSON.stringify({
    checkboxStatesCount: Object.keys(demoState.checkboxStates).length,
    selectedTab: demoState.selectedTab,
    showLoading: demoState.showLoading
  }, null, 2));

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏦 Banking Components Demo</Text>
          <Text style={styles.subtitle}>Simplified TypeScript Test</Text>
          <HelloWave />
        </View>

        {/* Simple Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔘 Test Section</Text>
          <ReusableButton
            titleButton="✅ Test Button"
            onPressActionButton={() => Alert.alert('Success', 'Test button pressed!')}
          />
          <ThemedText type="default">This is a test to isolate the crash</ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🏦 Banking App - Simplified Test Version
          </Text>
          <Text style={styles.footerText}>
            Testing basic component rendering with TypeScript
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ErrorBoundary>
  );
};

// Comprehensive styles with performance considerations
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: Metrics.large
  },
  header: {
    alignItems: "center",
    marginBottom: Metrics.xxLarge,
    paddingVertical: Metrics.large,
    backgroundColor: Colors.primary?.[100] || '#E3F2FD',
    borderRadius: 12
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: "bold",
    color: Colors.primary?.[400] || '#1976D2',
    marginBottom: Metrics.small,
    textAlign: "center"
  },
  subtitle: {
    fontSize: FontSize.medium,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Metrics.small
  },
  section: {
    marginBottom: Metrics.xxLarge,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Metrics.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Colors.primary?.[400] || '#1976D2',
    marginBottom: Metrics.medium,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary?.[100] || '#E3F2FD',
    paddingBottom: Metrics.small
  },
  sectionContent: {
    marginTop: Metrics.medium
  },
  componentTitle: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    marginTop: Metrics.small
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Metrics.small
  },
  helperText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Metrics.small
  },
  successText: {
    color: Colors.success || '#4CAF50',
    fontSize: FontSize.medium,
    textAlign: 'center',
    padding: Metrics.medium
  },
  conditionalText: {
    color: Colors.primary?.[300] || '#42A5F5',
    fontSize: FontSize.medium,
    textAlign: 'center',
    padding: Metrics.medium,
    backgroundColor: Colors.primary?.[100] || '#E1F5FE',
    borderRadius: 8,
    marginTop: Metrics.small
  },
  footer: {
    alignItems: "center",
    paddingVertical: Metrics.xxLarge,
    marginTop: Metrics.large
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 5
  }
});

export default ComponentsDemo;
