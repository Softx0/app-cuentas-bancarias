/**
 * Component Detail Screen Types
 * 
 * Defines types specific to the component detail screen
 * for showcasing individual component information and demos
 * 
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { TextStyle, ViewStyle } from 'react-native';
import { ComponentCategory, ComponentProp } from './ComponentDemo.types';

/**
 * Component detail data structure
 */
export interface ComponentDetailData {
  /** Component name */
  name: string;
  /** Component category */
  category: ComponentCategory;
  /** Detailed description */
  description: string;
  /** When to use this component */
  usage: string[];
  /** Component properties */
  props: ComponentProp[];
  /** Import path */
  importPath: string;
  /** Code examples */
  examples: CodeExample[];
  /** Related components */
  relatedComponents?: string[];
  /** Tips and best practices */
  tips?: string[];
}

/**
 * Code example structure
 */
export interface CodeExample {
  /** Example title */
  title: string;
  /** Example description */
  description?: string;
  /** Code snippet */
  code: string;
  /** Example type */
  type: 'basic' | 'advanced' | 'custom';
  /** Whether this is the primary example */
  isPrimary?: boolean;
}

/**
 * Interactive demo configuration
 */
export interface InteractiveDemoConfig {
  /** Whether to show interactive demo */
  enabled: boolean;
  /** Demo component props */
  initialProps?: Record<string, unknown>;
  /** Configurable properties for the demo */
  configurableProps?: ConfigurableProp[];
  /** Demo state */
  demoState?: Record<string, unknown>;
}

/**
 * Configurable property for interactive demo
 */
export interface ConfigurableProp {
  /** Property name */
  name: string;
  /** Property type */
  type: 'boolean' | 'string' | 'number' | 'select';
  /** Initial value */
  initialValue: unknown;
  /** Options for select type */
  options?: { label: string; value: unknown }[];
  /** Property description */
  description?: string;
}

/**
 * Component detail screen state
 */
export interface ComponentDetailState {
  /** Current selected tab */
  selectedTab: 'overview' | 'props' | 'examples' | 'demo';
  /** Interactive demo configuration */
  interactiveDemoConfig: InteractiveDemoConfig;
  /** Demo component state */
  demoComponentState: Record<string, unknown>;
  /** Whether component is loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Component detail screen styles
 */
export interface ComponentDetailStyles {
  container?: ViewStyle;
  header?: ViewStyle;
  title?: TextStyle;
  subtitle?: TextStyle;
  tabBar?: ViewStyle;
  tabButton?: ViewStyle;
  activeTabButton?: ViewStyle;
  tabText?: TextStyle;
  activeTabText?: TextStyle;
  section?: ViewStyle;
  sectionTitle?: TextStyle;
  sectionContent?: ViewStyle;
  propItem?: ViewStyle;
  propName?: TextStyle;
  propType?: TextStyle;
  propDescription?: TextStyle;
  codeContainer?: ViewStyle;
  codeText?: TextStyle;
  demoContainer?: ViewStyle;
  navigationButton?: ViewStyle;
  navigationButtonText?: TextStyle;
}

/**
 * Component detail screen handlers
 */
export interface ComponentDetailHandlers {
  /** Handle tab selection */
  onTabSelect: (tab: ComponentDetailState['selectedTab']) => void;
  /** Handle demo prop change */
  onDemoPropChange: (propName: string, value: unknown) => void;
  /** Handle navigation back */
  onNavigateBack: () => void;
  /** Handle navigate to related component */
  onNavigateToRelated: (componentName: string) => void;
  /** Handle demo action */
  onDemoAction: (action: string, payload?: unknown) => void;
}

/**
 * Tab configuration for detail screen
 */
export interface DetailTab {
  /** Tab ID */
  id: ComponentDetailState['selectedTab'];
  /** Tab title */
  title: string;
  /** Tab icon */
  icon: string;
  /** Whether tab is enabled */
  enabled: boolean;
}
