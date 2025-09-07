/**
 * Components Demo Screen - Banking Application
 * 
 * This screen serves as a comprehensive testing and validation environment
 * for all components in the banking application. It demonstrates proper usage,
 * different states, and styling options for each component.
 * 
 * @description Main demo screen for component testing
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import Colors and Themes
import Colors from "../../../../themes/Colors";
import { FontSize } from "../../../../themes/Fonts";
import Metrics from "../../../../themes/Metrics";

// Import Navigation Service
import NavigationService from "../../../infrastructure/services/NavigationService";

console.log('[ComponentsDemo] Starting imports...');

console.log('[ComponentsDemo] Theme imports completed');

console.log('[ComponentsDemo] Navigation service imported');

// Import Button Components (Essential only for debugging)
try {
  var ReusableButton = require("../../../../components/custom-button/ReusableButton").default;
  console.log('[ComponentsDemo] ReusableButton imported successfully');
} catch (error) {
  console.error('[ComponentsDemo] Error importing ReusableButton:', error);
  var ReusableButton = null;
}

try {
  var ButtonLiteReusable = require("../../../../components/custom-button/ButtonLiteReusable").default;
  console.log('[ComponentsDemo] ButtonLiteReusable imported successfully');
} catch (error) {
  console.error('[ComponentsDemo] Error importing ButtonLiteReusable:', error);
  var ButtonLiteReusable = null;
}

// Safe component fallback
const SafeButton = ({ title, onPress, style }) => {
  if (ReusableButton) {
    return (
      <ReusableButton
        titleButton={title}
        onPressActionButton={onPress}
        buttonStyle={style}
      />
    );
  }
  return (
    <View style={[{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }, style]}>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
        {title}
      </Text>
    </View>
  );
};

// Demo Icons (safe emoji fallbacks)
const DemoIcon = () => <Text style={{ fontSize: 20 }}>🎯</Text>;
const HomeIcon = () => <Text style={{ fontSize: 20 }}>🏠</Text>;
const ProfileIcon = () => <Text style={{ fontSize: 20 }}>👤</Text>;
const SettingsIcon = () => <Text style={{ fontSize: 20 }}>⚙️</Text>;

console.log('[ComponentsDemo] All imports completed');

/**
 * ComponentsDemo - Simplified main demo screen component
 * Reduced complexity for debugging
 */
const ComponentsDemo = () => {
  console.log('[ComponentsDemo] Component starting...');
  
  // Minimal state for testing
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  
  console.log('[ComponentsDemo] State initialized');

  // Simplified demo data
  const demoData = {
    title: "🏦 Banking Components Demo - Safe Mode",
    subtitle: "Minimal version for debugging"
  };
  
  console.log('[ComponentsDemo] Demo data prepared');

  // Simplified handlers
  const handleButtonPress = (buttonName) => {
    console.log('[ComponentsDemo] Button pressed:', buttonName);
    Alert.alert("Debug", `${buttonName} fue presionado - App funcionando correctamente`);
  };

  const handleLoadingTest = () => {
    console.log('[ComponentsDemo] Testing loading state');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Loading test completed!");
    }, 2000);
  };

  const renderSection = (title, children) => {
    console.log('[ComponentsDemo] Rendering section:', title);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </View>
    );
  };
  
  console.log('[ComponentsDemo] Handlers defined');

  console.log('[ComponentsDemo] Starting render...');
  
  try {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{demoData.title}</Text>
            <Text style={styles.subtitle}>{demoData.subtitle}</Text>
            <Text style={styles.debug}>
              ✅ App loaded successfully - Components working!
            </Text>
          </View>

          {/* Basic Button Test */}
          {renderSection("🔘 Basic Button Test", (
            <>
              <Text style={styles.componentTitle}>Primary Action Button</Text>
              
              {ReusableButton ? (
                <>
                  <ReusableButton
                    titleButton="✅ Test Primary Button"
                    onPressActionButton={() => handleButtonPress("Primary Button")}
                  />
                  
                  <ReusableButton
                    titleButton="🔄 Test Loading Button"
                    onPressActionButton={handleLoadingTest}
                    loading={loading}
                    buttonStyle={{ marginTop: 10 }}
                  />
                </>
              ) : (
                <SafeButton
                  title="⚠️ Fallback Button (ReusableButton failed to load)"
                  onPress={() => handleButtonPress("Fallback Button")}
                />
              )}
              
              {ButtonLiteReusable && (
                <ButtonLiteReusable
                  text="📱 Test List Button"
                  onPress={() => handleButtonPress("List Button")}
                  buttonStyle={{ marginTop: 15 }}
                />
              )}
            </>
          ))}

          {/* Debug Info */}
          {renderSection("🐛 Debug Information", (
            <>
              <Text style={styles.componentTitle}>Component Status</Text>
              <Text style={styles.debugText}>
                • ReusableButton: {ReusableButton ? '✅ Loaded' : '❌ Failed'}
              </Text>
              <Text style={styles.debugText}>
                • ButtonLiteReusable: {ButtonLiteReusable ? '✅ Loaded' : '❌ Failed'}
              </Text>
              <Text style={styles.debugText}>
                • Navigation Service: {NavigationService ? '✅ Available' : '❌ Not Available'}
              </Text>
              
              <Text style={[styles.componentTitle, { marginTop: 20 }]}>Navigation Test</Text>
              {ButtonLiteReusable && (
                <ButtonLiteReusable
                  text="🧭 Test Navigation to Details"
                  onPress={() => {
                    try {
                      NavigationService.navigateToComponentDetail('ReusableButton', 'Button Components');
                    } catch (error) {
                      console.error('[ComponentsDemo] Navigation error:', error);
                      Alert.alert('Navigation Error', error.message);
                    }
                  }}
                  buttonStyle={{ marginTop: 10 }}
                />
              )}
            </>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🏦 Banking App - Safe Mode Debug Version
            </Text>
            <Text style={styles.footerText}>
              If you see this, the basic app structure is working!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error('[ComponentsDemo] Render error:', error);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ ComponentsDemo Error</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <Text style={styles.errorStack}>{error.stack}</Text>
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Metrics.large,
  },
  header: {
    alignItems: "center",
    marginBottom: Metrics.xxLarge,
    paddingVertical: Metrics.large,
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: "bold",
    color: Colors.primary[400],
    marginBottom: Metrics.small,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.medium,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Metrics.small,
  },
  debug: {
    fontSize: FontSize.medium,
    color: Colors.success,
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: Colors.success + '20',
    padding: 10,
    borderRadius: 8,
  },
  section: {
    marginBottom: Metrics.xxLarge,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Metrics.large,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Colors.primary[400],
    marginBottom: Metrics.medium,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[100],
    paddingBottom: Metrics.small,
  },
  sectionContent: {
    marginTop: Metrics.medium,
  },
  componentTitle: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    marginTop: Metrics.small,
  },
  debugText: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: "center",
    paddingVertical: Metrics.xxLarge,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  errorStack: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});

export default ComponentsDemo;
