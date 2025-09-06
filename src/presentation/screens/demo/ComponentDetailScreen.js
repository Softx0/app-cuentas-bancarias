/**
 * Component Detail Screen - Banking Application
 * 
 * This screen shows detailed information about a specific component,
 * including usage examples, props documentation, and interactive demos.
 * 
 * @description Component detail screen for individual component testing
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import theme
import Colors from "../../../../themes/Colors";
import { FontSize } from "../../../../themes/Fonts";
import Metrics from "../../../../themes/Metrics";

// Import navigation service
import NavigationService from "../../../infrastructure/services/NavigationService";

// Import button components
import ButtonLiteReusable from "../../../../components/custom-button/ButtonLiteReusable";
import ReusableButton from "../../../../components/custom-button/ReusableButton";

/**
 * ComponentDetailScreen - Shows detailed information about a specific component
 */
const ComponentDetailScreen = ({ route }) => {
  const { componentName = "Unknown Component", componentType = "Unknown Type" } = route.params || {};
  
  const [testState, setTestState] = useState(false);

  const renderComponentDemo = () => {
    switch (componentName) {
      case "ReusableButton":
        return (
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Interactive Demo</Text>
            <ReusableButton
              titleButton="Test Primary Button"
              onPressActionButton={() => Alert.alert("Demo", "Primary button pressed!")}
            />
            <ReusableButton
              titleButton="Loading Button"
              onPressActionButton={() => {}}
              loading={testState}
              buttonStyle={{ marginTop: 10 }}
            />
            <ReusableButton
              titleButton="Toggle Loading"
              onPressActionButton={() => setTestState(!testState)}
              buttonStyle={{ marginTop: 10 }}
            />
          </View>
        );

      case "ButtonLiteReusable":
        return (
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Interactive Demo</Text>
            <ButtonLiteReusable
              text="Test List Button"
              onPress={() => Alert.alert("Demo", "List button pressed!")}
            />
            <ButtonLiteReusable
              text="Disabled Button"
              onPress={() => {}}
              isDisabled={true}
              buttonStyle={{ marginTop: 10 }}
            />
          </View>
        );

      default:
        return (
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Not Available</Text>
            <Text style={styles.demoDescription}>
              Interactive demo for {componentName} is not yet implemented.
            </Text>
          </View>
        );
    }
  };

  const componentData = getComponentData(componentName);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{componentName}</Text>
          <Text style={styles.subtitle}>{componentType}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Description</Text>
          <Text style={styles.description}>
            {componentData.description}
          </Text>
        </View>

        {/* Usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 When to Use</Text>
          {componentData.usage.map((use, index) => (
            <Text key={index} style={styles.usageItem}>
              • {use}
            </Text>
          ))}
        </View>

        {/* Props */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Key Props</Text>
          {componentData.props.map((prop, index) => (
            <View key={index} style={styles.propItem}>
              <Text style={styles.propName}>{prop.name}</Text>
              <Text style={styles.propType}>{prop.type}</Text>
              <Text style={styles.propDescription}>{prop.description}</Text>
            </View>
          ))}
        </View>

        {/* Interactive Demo */}
        {renderComponentDemo()}

        {/* Navigation Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧭 Navigation Examples</Text>
          <Text style={styles.description}>
            This screen demonstrates NavigationService usage:
          </Text>
          
          <ButtonLiteReusable
            text="Back to Components Demo"
            onPress={() => NavigationService.navigateToComponentsDemo()}
            buttonStyle={{ marginTop: 15 }}
          />
          
          <ButtonLiteReusable
            text="Navigate to Another Component"
            onPress={() => NavigationService.navigateToComponentDetail('ButtonLiteReusable', 'Button Components')}
            buttonStyle={{ marginTop: 10 }}
          />
          
          <ButtonLiteReusable
            text="Go Back (Previous Screen)"
            onPress={() => NavigationService.goBack()}
            buttonStyle={{ marginTop: 10 }}
          />
        </View>

        {/* Code Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💻 Code Example</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>
{`import ${componentName} from '${componentData.importPath}';

// Basic usage
<${componentName}
${componentData.example}
/>`}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📱 Component Detail - Powered by NavigationService
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Get component data for display
 * @param {string} componentName - Name of the component
 * @returns {object} Component data
 */
const getComponentData = (componentName) => {
  const componentDataMap = {
    ReusableButton: {
      description: "Primary action button for forms and main user actions. Features prominent styling with full background color and is designed to be the most important action on a screen.",
      usage: [
        "Form submissions (Login, Register, Save)",
        "Primary confirmations (Confirm Purchase, Submit Application)",
        "Main CTAs (Get Started, Continue, Next Step)"
      ],
      props: [
        {
          name: "titleButton",
          type: "string",
          description: "Text displayed on the button"
        },
        {
          name: "onPressActionButton",
          type: "function",
          description: "Function executed when button is pressed"
        },
        {
          name: "loading",
          type: "boolean",
          description: "Whether to show loading spinner"
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Whether the button is disabled"
        }
      ],
      importPath: '../../../components/custom-button/ReusableButton',
      example: `  titleButton="Submit Application"
  onPressActionButton={handleSubmit}
  loading={isSubmitting}`
    },
    ButtonLiteReusable: {
      description: "Lightweight button for list items, menu options, and secondary actions. Appears more like a list item or menu option with minimal visual weight.",
      usage: [
        "List items (Settings options, Menu items)",
        "Secondary actions (View Details, More Info)",
        "Filter/Sort options",
        "Navigation items in drawers/menus"
      ],
      props: [
        {
          name: "text",
          type: "string",
          description: "Button text content"
        },
        {
          name: "onPress",
          type: "function",
          description: "Function to execute when button is pressed"
        },
        {
          name: "isDisabled",
          type: "boolean",
          description: "Whether the button is disabled"
        },
        {
          name: "leftIcon",
          type: "React.Element",
          description: "Custom left icon component"
        }
      ],
      importPath: '../../../components/custom-button/ButtonLiteReusable',
      example: `  text="Account Settings"
  onPress={navigateToSettings}
  leftIcon={<SettingsIcon />}`
    }
  };

  return componentDataMap[componentName] || {
    description: "Component documentation not available.",
    usage: ["Usage information not available"],
    props: [],
    importPath: "Path not available",
    example: "Example not available"
  };
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
  },
  description: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  usageItem: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    lineHeight: 22,
  },
  propItem: {
    marginBottom: Metrics.medium,
    paddingBottom: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  propName: {
    fontSize: FontSize.medium,
    fontWeight: "bold",
    color: Colors.primary[300],
  },
  propType: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginVertical: 2,
  },
  propDescription: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
  },
  demoContainer: {
    backgroundColor: Colors.neutral[100],
    padding: Metrics.medium,
    borderRadius: 8,
    marginTop: Metrics.medium,
  },
  demoTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Colors.primary[400],
    marginBottom: Metrics.medium,
    textAlign: "center",
  },
  demoDescription: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    textAlign: "center",
    fontStyle: "italic",
  },
  codeContainer: {
    backgroundColor: Colors.neutral[800],
    padding: Metrics.medium,
    borderRadius: 8,
    marginTop: Metrics.small,
  },
  codeText: {
    fontSize: FontSize.small,
    color: Colors.white,
    fontFamily: "monospace",
  },
  footer: {
    alignItems: "center",
    paddingVertical: Metrics.xxLarge,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    fontStyle: "italic",
  },
});

export default ComponentDetailScreen;
