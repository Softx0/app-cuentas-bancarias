/**
 * Component Detail Screen - Banking Application
 * 
 * Shows detailed information about a specific component including usage examples,
 * props documentation, and interactive demos. Fully typed with TypeScript
 * and following clean architecture principles.
 * 
 * @description Component detail screen for individual component testing
 * @version 2.0.0
 * @author Eduardo Valenzuela
 */

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import theme and utilities
import Colors from "../../../../themes/Colors";
import { FontSize } from "../../../../themes/Fonts";
import Metrics from "../../../../themes/Metrics";

// Import navigation service
import NavigationService from "../../../infrastructure/services/NavigationService";

// Import types and data
import { COMPONENT_INFO } from "./data/ComponentDemoData";
import {
  ComponentCategory,
  ComponentProp
} from "./types/ComponentDemo.types";
import {
  ComponentDetailData,
  ComponentDetailHandlers,
  ComponentDetailState
} from "./types/ComponentDetail.types";
import {
  DemoNavigationParamList
} from "./types/NavigationDemo.types";

// Import button components for examples
import CheckBoxReusable from "../../../../components/CheckBoxReusable/CheckBoxReusable";
import ButtonLiteReusable from "../../../../components/custom-button/ButtonLiteReusable";
import ReusableButton from "../../../../components/custom-button/ReusableButton";
import InputTextReusable from "../../../../components/custom-input/InputTextReusable";

// Type for screen props
type ComponentDetailScreenProps = NativeStackScreenProps<DemoNavigationParamList, 'ComponentDetail'>;

console.log('[ComponentDetailScreen] Initializing TypeScript component detail screen...');

/**
 * ComponentDetailScreen - Shows detailed information about a specific component
 * with interactive demos and comprehensive documentation
 */
const ComponentDetailScreen: React.FC<ComponentDetailScreenProps> = ({ route }) => {
  console.log('[ComponentDetailScreen] Screen props received:', JSON.stringify({
    componentName: route.params?.componentName,
    componentType: route.params?.componentType,
    category: route.params?.category
  }, null, 2));

  // Extract route parameters with defaults
  const { 
    componentName = "Unknown Component", 
    componentType = "Unknown Type",
    category = ComponentCategory.BUTTON
  } = route.params || {};

  // Component state with proper typing
  const [screenState, setScreenState] = useState<ComponentDetailState>({
    selectedTab: 'overview',
    interactiveDemoConfig: {
      enabled: true,
      initialProps: {},
      configurableProps: []
    },
    demoComponentState: {
      textValue: '',
      isChecked: false,
      isLoading: false
    },
    loading: false,
    error: null
  });

  // Memoized component data
  const componentData: ComponentDetailData | null = useMemo(() => {
    const info = COMPONENT_INFO[componentName];
    if (!info) {
      console.warn('[ComponentDetailScreen] No component info found for:', componentName);
      return null;
    }

    return {
      name: info.name,
      category: info.category,
      description: info.description,
      usage: info.usage,
      props: info.keyProps,
      importPath: info.importPath,
      examples: [
        {
          title: 'Basic Usage',
          description: 'Standard implementation of the component',
          code: info.example,
          type: 'basic',
          isPrimary: true
        }
      ],
      relatedComponents: getRelatedComponents(info.category),
      tips: getComponentTips(componentName)
    };
  }, [componentName]);

  // Memoized event handlers for performance
  const handlers: ComponentDetailHandlers = useMemo(() => ({
    onTabSelect: (tab: ComponentDetailState['selectedTab']) => {
      console.log('[ComponentDetailScreen] Tab selected:', JSON.stringify({ tab }, null, 2));
      setScreenState((prev: ComponentDetailState) => ({ ...prev, selectedTab: tab }));
    },
    
    onDemoPropChange: (propName: string, value: unknown) => {
      console.log('[ComponentDetailScreen] Demo prop changed:', JSON.stringify({ propName, value }, null, 2));
      setScreenState((prev: ComponentDetailState) => ({
        ...prev,
        demoComponentState: {
          ...prev.demoComponentState,
          [propName]: value
        }
      }));
    },
    
    onNavigateBack: () => {
      NavigationService.goBack();
    },
    
    onNavigateToRelated: (relatedComponentName: string) => {
      try {
        NavigationService.navigateToComponentDetail(relatedComponentName, 'Demo Component', category);
      } catch (error) {
        console.error('[ComponentDetailScreen] Navigation error:', error);
        Alert.alert('Navigation Error', 'Could not navigate to related component');
      }
    },
    
    onDemoAction: (action: string, payload?: unknown) => {
      console.log('[ComponentDetailScreen] Demo action:', JSON.stringify({ action, payload }, null, 2));
      
      switch (action) {
        case 'toggleLoading':
          setScreenState((prev: ComponentDetailState) => ({
            ...prev,
            demoComponentState: {
              ...prev.demoComponentState,
              isLoading: !prev.demoComponentState.isLoading
            }
          }));
          break;
        case 'toggleCheck':
          setScreenState((prev: ComponentDetailState) => ({
            ...prev,
            demoComponentState: {
              ...prev.demoComponentState,
              isChecked: !prev.demoComponentState.isChecked
            }
          }));
          break;
        case 'updateText':
          setScreenState((prev: ComponentDetailState) => ({
            ...prev,
            demoComponentState: {
              ...prev.demoComponentState,
              textValue: payload as string
            }
          }));
          break;
        default:
          Alert.alert('Demo Action', `${action} executed successfully`);
      }
    }
  }), [category]);

  // Memoized tab configuration
  const tabs = useMemo(() => [
    { id: 'overview' as const, title: 'Overview', icon: '📋', enabled: true },
    { id: 'props' as const, title: 'Props', icon: '⚙️', enabled: true },
    { id: 'examples' as const, title: 'Examples', icon: '💻', enabled: true },
    { id: 'demo' as const, title: 'Interactive', icon: '🎮', enabled: true }
  ], []);

  // Render tab bar
  const renderTabBar = useCallback(() => (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabButton,
            screenState.selectedTab === tab.id && styles.activeTabButton
          ]}
          onPress={() => handlers.onTabSelect(tab.id)}
          disabled={!tab.enabled}
        >
          <Text style={styles.tabText}>{tab.icon}</Text>
          <Text
            style={[
              styles.tabText,
              screenState.selectedTab === tab.id && styles.activeTabText
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ), [tabs, screenState.selectedTab, handlers]);

  // Render overview content
  const renderOverview = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Description</Text>
      <Text style={styles.description}>
        {componentData?.description || 'No description available'}
      </Text>
      
      <Text style={styles.sectionTitle}>💡 When to Use</Text>
      {componentData?.usage.map((use: string, index: number) => (
        <Text key={index} style={styles.usageItem}>
          • {use}
        </Text>
      )) || <Text style={styles.usageItem}>No usage information available</Text>}
      
      <Text style={styles.sectionTitle}>📦 Import</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>
          {`import ${componentName} from '${componentData?.importPath || 'unknown'}';`}
        </Text>
      </View>
    </View>
  ), [componentData, componentName]);

  // Render props content
  const renderProps = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⚙️ Component Props</Text>
      {componentData?.props.map((prop: ComponentProp, index: number) => (
        <View key={index} style={styles.propItem}>
          <Text style={styles.propName}>
            {prop.name} {prop.required && <Text style={styles.requiredMark}>*</Text>}
          </Text>
          <Text style={styles.propType}>{prop.type}</Text>
          <Text style={styles.propDescription}>{prop.description}</Text>
          {prop.defaultValue && (
            <Text style={styles.defaultValue}>Default: {prop.defaultValue}</Text>
          )}
        </View>
      )) || <Text>No props information available</Text>}
    </View>
  ), [componentData]);

  // Render examples content
  const renderExamples = useCallback(() => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>💻 Code Examples</Text>
      {componentData?.examples.map((example: ComponentDetailData['examples'][0], index: number) => (
        <View key={index} style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>
            {example.title} {example.isPrimary && '⭐'}
          </Text>
          {example.description && (
            <Text style={styles.exampleDescription}>{example.description}</Text>
          )}
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{example.code}</Text>
          </View>
        </View>
      )) || (
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>
            {componentData?.examples[0]?.code || 'No examples available'}
          </Text>
        </View>
      )}
    </View>
  ), [componentData]);


  // Render specific component demo based on component name
  const renderComponentDemo = useCallback(() => {
    const { demoComponentState } = screenState;
    
    switch (componentName) {
      case 'ReusableButton':
        return (
          <ReusableButton
            titleButton="Demo Button"
            onPressActionButton={() => handlers.onDemoAction('buttonPressed')}
            loading={demoComponentState.isLoading as boolean}
            disabled={false}
          />
        );
        
      case 'ButtonLiteReusable':
        return (
          <ButtonLiteReusable
            text="Demo List Button"
            onPress={() => handlers.onDemoAction('listButtonPressed')}
            isDisabled={false}
          />
        );
        
      case 'InputTextReusable':
        return (
          <InputTextReusable
            label="Demo Input"
            value={demoComponentState.textValue as string}
            onChangeText={(value: string) => handlers.onDemoPropChange('textValue', value)}
            placeholder="Type something..."
          />
        );
        
      case 'CheckBoxReusable':
        return (
          <CheckBoxReusable
            title="Demo Checkbox"
            checked={demoComponentState.isChecked as boolean}
            onPress={() => handlers.onDemoAction('toggleCheck')}
            checkedIcon={<Text style={{ color: '#007AFF' }}>✅</Text>}
            uncheckedIcon={<Text style={{ color: '#C7C7CC' }}>☐</Text>}
          />
        );
        
      default:
        return (
          <View style={styles.demoPlaceholder}>
            <Text style={styles.demoPlaceholderText}>
              🎮 Interactive demo for {componentName}
            </Text>
            <Text style={styles.demoDescription}>
              Component demo would be rendered here with live interactions
            </Text>
          </View>
        );
    }
  }, [componentName, screenState, handlers]);

  // Render demo controls
  const renderDemoControls = useCallback(() => (
    <View style={styles.controlsContainer}>
      <ButtonLiteReusable
        text={`${screenState.demoComponentState.isLoading ? 'Stop' : 'Start'} Loading`}
        onPress={() => handlers.onDemoAction('toggleLoading')}
        buttonStyle={styles.controlButton}
      />
      <ButtonLiteReusable
        text="Toggle Check State"
        onPress={() => handlers.onDemoAction('toggleCheck')}
        buttonStyle={styles.controlButton}
      />
      <ButtonLiteReusable
        text="Reset Demo"
        onPress={() => setScreenState((prev: ComponentDetailState) => ({
          ...prev,
          demoComponentState: { textValue: '', isChecked: false, isLoading: false }
        }))}
        buttonStyle={styles.controlButton}
      />
    </View>
  ), [screenState.demoComponentState, handlers]);

  // Render interactive demo content
  const renderInteractiveDemo = useCallback(() => {
    if (!screenState.interactiveDemoConfig.enabled) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Interactive Demo</Text>
          <Text style={styles.description}>Interactive demo not available for this component</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Interactive Demo</Text>
        <View style={styles.demoContainer}>
          {renderComponentDemo()}
        </View>
        
        <Text style={styles.sectionTitle}>🎛️ Demo Controls</Text>
        <View style={styles.demoControls}>
          {renderDemoControls()}
        </View>
      </View>
    );
  }, [screenState.interactiveDemoConfig.enabled, renderComponentDemo, renderDemoControls]);

  // Render tab content based on selected tab
  const renderTabContent = useCallback(() => {
    switch (screenState.selectedTab) {
      case 'overview':
        return renderOverview();
      case 'props':
        return renderProps();
      case 'examples':
        return renderExamples();
      case 'demo':
        return renderInteractiveDemo();
      default:
        return renderOverview();
    }
  }, [screenState.selectedTab, renderOverview, renderProps, renderExamples, renderInteractiveDemo]);

  // Handle missing component data
  if (!componentData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Component Not Found</Text>
          <Text style={styles.errorMessage}>
            No information available for component: {componentName}
          </Text>
          <ButtonLiteReusable
            text="← Go Back"
            onPress={handlers.onNavigateBack}
            buttonStyle={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  console.log('[ComponentDetailScreen] Rendering with component:', JSON.stringify({
    name: componentData.name,
    category: componentData.category,
    selectedTab: screenState.selectedTab
  }, null, 2));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{componentData.name}</Text>
          <Text style={styles.subtitle}>{componentType}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{componentData.category}</Text>
          </View>
        </View>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Tab Content */}
        {renderTabContent()}

        {/* Related Components */}
        {componentData.relatedComponents && componentData.relatedComponents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 Related Components</Text>
            <View style={styles.relatedContainer}>
              {componentData.relatedComponents.map((relatedName: string, index: number) => (
                <ButtonLiteReusable
                  key={index}
                  text={`→ ${relatedName}`}
                  onPress={() => handlers.onNavigateToRelated(relatedName)}
                  buttonStyle={styles.relatedButton}
                />
              ))}
            </View>
          </View>
        )}

        {/* Navigation Actions */}
        <View style={styles.navigationSection}>
          <Text style={styles.sectionTitle}>🧭 Navigation</Text>
          <View style={styles.navigationContainer}>
            <ButtonLiteReusable
              text="← Back to Components"
              onPress={handlers.onNavigateBack}
              buttonStyle={styles.navigationButton}
            />
            <ButtonLiteReusable
              text="View All Components"
              onPress={() => NavigationService.navigateToComponentsDemo()}
              buttonStyle={styles.navigationButton}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📱 Component Detail - TypeScript Enhanced
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions
function getRelatedComponents(category: ComponentCategory): string[] {
  switch (category) {
    case ComponentCategory.BUTTON:
      return ['ReusableButton', 'ButtonLiteReusable', 'ButtonNavigationBarReusable'];
    case ComponentCategory.INPUT:
      return ['InputTextReusable', 'SearchTextInputReusable'];
    case ComponentCategory.SELECTION:
      return ['CheckBoxReusable', 'RadioButtonReusable', 'CustomCheckbox'];
    case ComponentCategory.DROPDOWN:
      return ['DropDownListReusable', 'DropDownListCountryReusable', 'DropDownListMultipleReusable'];
    default:
      return [];
  }
}

function getComponentTips(componentName: string): string[] {
  const commonTips: Record<string, string[]> = {
    'ReusableButton': [
      'Use for primary actions that need user attention',
      'Consider loading state for async operations',
      'Provide clear, action-oriented text'
    ],
    'ButtonLiteReusable': [
      'Perfect for secondary actions and list items',
      'Use icons to improve visual hierarchy',
      'Keep text concise and descriptive'
    ],
    'InputTextReusable': [
      'Always provide meaningful labels',
      'Use appropriate keyboard types',
      'Include validation feedback for better UX'
    ],
    'CheckBoxReusable': [
      'Use clear, positive language for labels',
      'Group related checkboxes logically',
      'Provide visual feedback for state changes'
    ]
  };
  
  return commonTips[componentName] || ['Follow component documentation for best practices'];
}

// Comprehensive styles with TypeScript support
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
    marginBottom: Metrics.large,
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
  categoryBadge: {
    backgroundColor: Colors.primary?.[300] || '#42A5F5',
    paddingHorizontal: Metrics.medium,
    paddingVertical: Metrics.small,
    borderRadius: 16
  },
  categoryText: {
    color: Colors.white,
    fontSize: FontSize.small,
    fontWeight: "600"
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Metrics.small,
    marginBottom: Metrics.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Metrics.medium,
    borderRadius: 8
  },
  activeTabButton: {
    backgroundColor: Colors.primary?.[100] || '#E3F2FD'
  },
  tabText: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginVertical: 2
  },
  activeTabText: {
    color: Colors.primary?.[400] || '#1976D2',
    fontWeight: "600"
  },
  section: {
    marginBottom: Metrics.large,
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
    marginBottom: Metrics.medium
  },
  description: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Metrics.medium
  },
  usageItem: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    marginBottom: Metrics.small,
    lineHeight: 22
  },
  propItem: {
    marginBottom: Metrics.medium,
    paddingBottom: Metrics.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral?.[200] || '#E0E0E0'
  },
  propName: {
    fontSize: FontSize.medium,
    fontWeight: "bold",
    color: Colors.primary?.[300] || '#42A5F5'
  },
  propType: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginVertical: 2
  },
  propDescription: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary
  },
  requiredMark: {
    color: Colors.error || '#F44336'
  },
  defaultValue: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4
  },
  exampleContainer: {
    marginBottom: Metrics.large
  },
  exampleTitle: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Metrics.small
  },
  exampleDescription: {
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    marginBottom: Metrics.small
  },
  codeContainer: {
    backgroundColor: Colors.neutral?.[800] || '#424242',
    padding: Metrics.medium,
    borderRadius: 8,
    marginVertical: Metrics.small
  },
  codeText: {
    fontSize: FontSize.small,
    color: Colors.white,
    fontFamily: "monospace"
  },
  demoContainer: {
    backgroundColor: Colors.neutral?.[100] || '#F5F5F5',
    padding: Metrics.large,
    borderRadius: 8,
    marginBottom: Metrics.medium,
    alignItems: 'center'
  },
  demoPlaceholder: {
    alignItems: 'center',
    padding: Metrics.large
  },
  demoPlaceholderText: {
    fontSize: FontSize.large,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Metrics.small
  },
  demoDescription: {
    fontSize: FontSize.medium,
    color: Colors.textSecondary,
    textAlign: 'center'
  },
  demoControls: {
    marginTop: Metrics.medium
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  controlButton: {
    flex: 1,
    marginHorizontal: Metrics.small,
    marginVertical: Metrics.small,
    minWidth: 100
  },
  relatedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  relatedButton: {
    marginRight: Metrics.small,
    marginBottom: Metrics.small
  },
  navigationSection: {
    marginTop: Metrics.large
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: Metrics.small
  },
  footer: {
    alignItems: "center",
    paddingVertical: Metrics.xxLarge,
    marginTop: Metrics.large
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    fontStyle: "italic"
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.large
  },
  errorTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: Colors.error || '#F44336',
    marginBottom: Metrics.medium,
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    marginBottom: Metrics.large,
    textAlign: 'center'
  },
  backButton: {
    marginTop: Metrics.medium
  }
});

export default ComponentDetailScreen;
