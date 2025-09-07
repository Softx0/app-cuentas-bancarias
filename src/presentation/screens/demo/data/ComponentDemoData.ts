/**
 * Component Demo Data
 * 
 * Comprehensive demo data for all reusable components
 * following clean architecture and TypeScript best practices
 * 
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import {
  ComponentCategory,
  ComponentDemoInfo,
  CountryOption,
  DemoSection,
  DropdownOption,
  TabOption
} from '../types/ComponentDemo.types';

/**
 * Demo sections configuration
 * Organizes components into logical categories
 */
export const DEMO_SECTIONS: DemoSection[] = [
  {
    title: 'Button Components',
    icon: '🔘',
    category: ComponentCategory.BUTTON,
    description: 'Interactive button components for various use cases',
    components: ['ReusableButton', 'ButtonLiteReusable', 'ButtonNavigationBarReusable', 'ButtonCalendarReusable']
  },
  {
    title: 'Input Components', 
    icon: '📝',
    category: ComponentCategory.INPUT,
    description: 'Text input and search components with validation',
    components: ['InputTextReusable', 'SearchTextInputReusable']
  },
  {
    title: 'Selection Components',
    icon: '☑️',
    category: ComponentCategory.SELECTION,
    description: 'Checkboxes, radio buttons and selection controls',
    components: ['CheckBoxReusable', 'RadioButtonReusable', 'RadioButtonDoubleReusable', 'CustomCheckbox']
  },
  {
    title: 'Dropdown Components',
    icon: '📋',
    category: ComponentCategory.DROPDOWN,
    description: 'Dropdown lists and selection pickers',
    components: ['DropDownListReusable', 'DropDownListCountryReusable', 'DropDownListMultipleReusable', 'CustomDropdown']
  },
  {
    title: 'Date & Time Components',
    icon: '📅',
    category: ComponentCategory.DATE_TIME,
    description: 'Date and time selection components',
    components: ['CalendarPickerRangeReusable', 'DateTimePickerReusable']
  },
  {
    title: 'Feedback Components',
    icon: '💬',
    category: ComponentCategory.FEEDBACK,
    description: 'Loading indicators, alerts and user feedback',
    components: ['Loading', 'CustomLoading', 'Snackbar', 'HayErrorResultadosReusable', 'NoHayResultadosReusable']
  },
  {
    title: 'Layout Components',
    icon: '📐',
    category: ComponentCategory.LAYOUT,
    description: 'Layout and structural components',
    components: ['CustomContainer', 'CustomSeparator', 'TabBarReusable', 'StepInfo']
  },
  {
    title: 'Utility Components',
    icon: '🔧',
    category: ComponentCategory.UTILITY,
    description: 'Utility and conditional rendering components',
    components: ['ConditionalRendererReusable', 'CheckRender', 'Pill']
  }
];

/**
 * Comprehensive component information database
 */
export const COMPONENT_INFO: Record<string, ComponentDemoInfo> = {
  // Button Components
  ReusableButton: {
    name: 'ReusableButton',
    category: ComponentCategory.BUTTON,
    description: 'Primary action button for forms and main user actions. Features prominent styling with full background color and is designed to be the most important action on a screen.',
    usage: [
      'Form submissions (Login, Register, Save)',
      'Primary confirmations (Confirm Purchase, Submit Application)',
      'Main CTAs (Get Started, Continue, Next Step)'
    ],
    keyProps: [
      { name: 'titleButton', type: 'string', description: 'Text displayed on the button', required: true },
      { name: 'onPressActionButton', type: 'function', description: 'Function executed when button is pressed', required: true },
      { name: 'loading', type: 'boolean', description: 'Whether to show loading spinner', defaultValue: 'false' },
      { name: 'disabled', type: 'boolean', description: 'Whether the button is disabled', defaultValue: 'false' }
    ],
    importPath: 'components/custom-button/ReusableButton',
    example: `<ReusableButton
  titleButton="Submit Application"
  onPressActionButton={handleSubmit}
  loading={isSubmitting}
/>`
  },

  ButtonLiteReusable: {
    name: 'ButtonLiteReusable',
    category: ComponentCategory.BUTTON,
    description: 'Lightweight button for list items, menu options, and secondary actions. Appears more like a list item or menu option with minimal visual weight.',
    usage: [
      'List items (Settings options, Menu items)',
      'Secondary actions (View Details, More Info)',
      'Filter/Sort options',
      'Navigation items in drawers/menus'
    ],
    keyProps: [
      { name: 'text', type: 'string', description: 'Button text content', required: true },
      { name: 'onPress', type: 'function', description: 'Function to execute when button is pressed', required: true },
      { name: 'isDisabled', type: 'boolean', description: 'Whether the button is disabled', defaultValue: 'false' },
      { name: 'leftIcon', type: 'React.Element', description: 'Custom left icon component' }
    ],
    importPath: 'components/custom-button/ButtonLiteReusable',
    example: `<ButtonLiteReusable
  text="Account Settings"
  onPress={navigateToSettings}
  leftIcon={<SettingsIcon />}
/>`
  },

  // Input Components  
  InputTextReusable: {
    name: 'InputTextReusable',
    category: ComponentCategory.INPUT,
    description: 'Versatile text input component with validation support, custom styling, and accessibility features.',
    usage: [
      'Form fields (Name, Email, Password)',
      'Search inputs with validation',
      'Multiline text areas',
      'Secure text entry fields'
    ],
    keyProps: [
      { name: 'value', type: 'string', description: 'Current input value', required: true },
      { name: 'onChangeText', type: 'function', description: 'Callback when text changes', required: true },
      { name: 'placeholder', type: 'string', description: 'Placeholder text' },
      { name: 'label', type: 'string', description: 'Input label' },
      { name: 'errorMessage', type: 'string', description: 'Error message to display' },
      { name: 'secureTextEntry', type: 'boolean', description: 'Whether to hide text input', defaultValue: 'false' }
    ],
    importPath: 'components/custom-input/InputTextReusable',
    example: `<InputTextReusable
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  errorMessage={emailError}
/>`
  },

  // Selection Components
  CheckBoxReusable: {
    name: 'CheckBoxReusable',
    category: ComponentCategory.SELECTION,
    description: 'Custom checkbox component that replaces react-native-elements CheckBox using only React Native native components.',
    usage: [
      'Form selections (Terms acceptance)',
      'Multiple choice options',
      'Settings toggles',
      'List item selection'
    ],
    keyProps: [
      { name: 'checked', type: 'boolean', description: 'Whether checkbox is checked', required: true },
      { name: 'onPress', type: 'function', description: 'Callback when pressed', required: true },
      { name: 'title', type: 'string', description: 'Text to display next to checkbox' },
      { name: 'disabled', type: 'boolean', description: 'Whether checkbox is disabled', defaultValue: 'false' }
    ],
    importPath: 'components/CheckBoxReusable/CheckBoxReusable',
    example: `<CheckBoxReusable
  title="Accept Terms and Conditions"
  checked={acceptedTerms}
  onPress={() => setAcceptedTerms(!acceptedTerms)}
/>`
  }
};

/**
 * Sample dropdown data
 */
export const SAMPLE_DROPDOWN_OPTIONS: DropdownOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Disabled Option', value: '4', disabled: true },
  { label: 'Option 5', value: '5' }
];

/**
 * Sample country data for country dropdown
 */
export const SAMPLE_COUNTRIES: CountryOption[] = [
  { idCountry: 'US', countryName: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { idCountry: 'MX', countryName: 'Mexico', flag: '🇲🇽', phoneCode: '+52' },
  { idCountry: 'CA', countryName: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { idCountry: 'ES', countryName: 'Spain', flag: '🇪🇸', phoneCode: '+34' },
  { idCountry: 'FR', countryName: 'France', flag: '🇫🇷', phoneCode: '+33' },
  { idCountry: 'DE', countryName: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { idCountry: 'IT', countryName: 'Italy', flag: '🇮🇹', phoneCode: '+39' },
  { idCountry: 'BR', countryName: 'Brazil', flag: '🇧🇷', phoneCode: '+55' }
];

/**
 * Sample tab data for TabBar component
 */
export const SAMPLE_TABS: TabOption[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'help', label: 'Help', icon: '❓', badgeCount: 2 },
  { id: 'disabled', label: 'Disabled', icon: '🚫', disabled: true }
];

/**
 * Sample navigation bar buttons
 */
export const SAMPLE_NAV_BUTTONS = [
  { title: 'Home', icon: '🏠', onPress: () => console.log('Home pressed') },
  { title: 'Search', icon: '🔍', onPress: () => console.log('Search pressed') },
  { title: 'Profile', icon: '👤', onPress: () => console.log('Profile pressed') },
  { title: 'Settings', icon: '⚙️', onPress: () => console.log('Settings pressed') }
];
