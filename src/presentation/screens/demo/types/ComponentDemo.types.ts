/**
 * Component Demo Types & Interfaces
 * 
 * Defines all TypeScript types and interfaces used in the component demo screens
 * following clean architecture and TypeScript best practices
 * 
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { TextStyle, ViewStyle } from 'react-native';

/**
 * Component categories for organization and navigation
 */
export enum ComponentCategory {
  BUTTON = 'button',
  INPUT = 'input',
  SELECTION = 'selection',
  DROPDOWN = 'dropdown',
  DATE_TIME = 'date_time',
  FEEDBACK = 'feedback',
  LAYOUT = 'layout',
  UTILITY = 'utility',
  EXPO = 'expo'
}

/**
 * Component demo information structure
 */
export interface ComponentDemoInfo {
  /** Component name as displayed in UI */
  name: string;
  /** Category the component belongs to */
  category: ComponentCategory;
  /** Brief description of the component */
  description: string;
  /** Usage examples or when to use */
  usage: string[];
  /** Key properties of the component */
  keyProps: ComponentProp[];
  /** Import path for the component */
  importPath: string;
  /** Code example */
  example: string;
}

/**
 * Component property information
 */
export interface ComponentProp {
  /** Property name */
  name: string;
  /** TypeScript type */
  type: string;
  /** Property description */
  description: string;
  /** Whether the property is required */
  required?: boolean;
  /** Default value if any */
  defaultValue?: string;
}

/**
 * Demo section structure for organizing components
 */
export interface DemoSection {
  /** Section title */
  title: string;
  /** Section icon (emoji or component) */
  icon: string;
  /** Category this section represents */
  category: ComponentCategory;
  /** Components in this section */
  components: string[];
  /** Section description */
  description: string;
}

/**
 * Demo data for dropdown components
 */
export interface DropdownOption {
  /** Display label */
  label: string;
  /** Option value */
  value: string | number;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Additional data for the option */
  data?: Record<string, unknown>;
}

/**
 * Country data structure for country dropdown
 */
export interface CountryOption {
  /** Country ID */
  idCountry: string | number;
  /** Country name */
  countryName: string;
  /** Country code (ISO) */
  countryCode?: string;
  /** Country flag emoji or image */
  flag?: string;
  /** Phone country code */
  phoneCode?: string;
}

/**
 * Tab data for TabBar component
 */
export interface TabOption {
  /** Tab ID */
  id: string;
  /** Tab label */
  label: string;
  /** Tab icon */
  icon?: React.ReactNode;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Badge count if any */
  badgeCount?: number;
}

/**
 * Demo component state interface
 */
export interface DemoState {
  // Input states
  textInputValue: string;
  searchValue: string;
  
  // Selection states
  checkboxStates: Record<string, boolean>;
  radioValue: string;
  doubleRadioLeft: boolean;
  doubleRadioRight: boolean;
  
  // Dropdown states
  selectedDropdownValue: string | null;
  selectedCountry: CountryOption | null;
  selectedMultipleValues: string[];
  
  // Date/Time states
  selectedDate: Date | null;
  selectedDateRange: {
    startDate: string;
    endDate: string;
  };
  
  // Feedback states
  showLoading: boolean;
  showSnackbar: boolean;
  showError: boolean;
  showNoResults: boolean;
  
  // Layout states
  selectedTab: string;
  currentStep: number;
  
  // Utility states
  showConditionalContent: boolean;
}

/**
 * Custom styles for demo components
 */
export interface DemoStyles {
  container?: ViewStyle;
  section?: ViewStyle;
  sectionHeader?: ViewStyle;
  sectionTitle?: TextStyle;
  componentContainer?: ViewStyle;
  componentTitle?: TextStyle;
  separator?: ViewStyle;
  demoButton?: ViewStyle;
  demoButtonText?: TextStyle;
}

/**
 * Demo action handlers interface
 */
export interface DemoHandlers {
  onTextInputChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onCheckboxToggle: (key: string) => void;
  onRadioSelect: (value: string) => void;
  onDropdownSelect: (value: string) => void;
  onCountrySelect: (country: CountryOption) => void;
  onMultipleSelect: (values: string[]) => void;
  onDateSelect: (date: Date) => void;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  onTabSelect: (tabId: string) => void;
  onStepChange: (step: number) => void;
  onToggleLoading: () => void;
  onShowSnackbar: () => void;
  onShowError: () => void;
  onShowNoResults: () => void;
  onNavigateToDetail: (componentName: string, category: ComponentCategory) => void;
}

/**
 * Component demo props interface
 */
export interface ComponentDemoProps {
  /** Demo state */
  state: DemoState;
  /** Event handlers */
  handlers: DemoHandlers;
  /** Custom styles */
  styles?: DemoStyles;
  /** Whether component is in loading state */
  loading?: boolean;
  /** Error message if any */
  error?: string;
}

