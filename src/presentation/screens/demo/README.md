# 🏦 Banking Components Demo Screen

## Overview

The **ComponentsDemo** screen is a comprehensive testing and validation environment for all components in the banking application. It serves as the main entry point to test, validate, and demonstrate the proper usage of every reusable component.

## 🎯 Purpose

- **Component Testing**: Validate that all components work correctly
- **State Testing**: Test different component states (loading, error, disabled, etc.)
- **Integration Validation**: Ensure components work well with the theme system
- **Visual Verification**: Confirm proper styling and responsive behavior
- **Development Tool**: Quick access to component functionality during development

## 📱 How to Use

### As Main App Screen

To set this as your main screen after app startup, update your navigation configuration to point to `ComponentsDemo`:

```javascript
// In your main navigation file
import { ComponentsDemo } from '../src/presentation/screens/demo';

// Set as initial route
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Screen 
      name="ComponentsDemo" 
      component={ComponentsDemo}
      options={{ title: "Banking Components Demo" }}
    />
  </NavigationContainer>
);
```

### Navigation Integration

```javascript
// For React Navigation v6
import { ComponentsDemo } from './src/presentation/screens/demo';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ComponentsDemo">
        <Stack.Screen 
          name="ComponentsDemo" 
          component={ComponentsDemo}
          options={{
            title: "🏦 Banking Components",
            headerStyle: {
              backgroundColor: Colors.primary[300],
            },
            headerTintColor: Colors.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🧪 Components Tested

### 🔘 Button Components
- **ReusableButton**: Primary action buttons with loading and disabled states
- **ButtonLiteReusable**: Lightweight list/menu buttons
- **ButtonNavigationBarReusable**: Navigation bars with multiple buttons

### 📝 Input Components  
- **InputTextReusable**: Text inputs with validation and error states
- **SearchTextInputReusable**: Search inputs with filter functionality

### ☑️ Selection Components
- **CheckBoxReusable**: Checkboxes with custom styling
- **CustomCheckbox**: Alternative checkbox implementation
- **RadioButtonReusable**: Single radio button components
- **RadioButtonDoubleReusable**: Dual radio button groups

### 📋 Dropdown Components
- **DropDownListReusable**: Simple dropdown selection
- **DropDownListCountryReusable**: Country-specific dropdown with flags
- **DropDownListMultipleReusable**: Multiple selection dropdown

### 📅 Calendar Components
- **CalendarPickerRangeReusable**: Date range picker with calendar interface

### 🔧 Utility Components
- **Loading**: Loading indicators in different sizes and colors
- **StepInfo**: Step progress indicators
- **TabBarReusable**: Tab navigation components  
- **CustomSeparator**: Visual separators
- **ConditionalRendererReusable**: Conditional content rendering
- **CheckRender**: Conditional visibility wrapper
- **Snackbar**: Toast notifications and feedback

## 🎨 Features Demonstrated

### Interactive Testing
- **Real State Changes**: All components respond to user interaction
- **Form Validation**: See error states and validation in action
- **Loading States**: Test async operations and loading indicators
- **Disabled States**: Verify accessibility and disabled functionality

### Visual Validation
- **Theme Integration**: All components use the new color system
- **Responsive Design**: Components adapt to different screen sizes
- **Consistent Styling**: Verify design system implementation
- **Proper Spacing**: Validate Metrics usage throughout

### Functional Testing
- **Event Handling**: Test all component callbacks and handlers
- **State Management**: Verify component state updates
- **Data Flow**: Test component data passing and transformation
- **Error Handling**: Validate error states and recovery

## 🔧 Customization

### Adding New Components

To add a new component to the demo:

1. **Import the component**:
```javascript
import NewComponent from "../../../components/new-component/NewComponent";
```

2. **Add state if needed**:
```javascript
const [newComponentState, setNewComponentState] = useState(initialValue);
```

3. **Add to appropriate section**:
```javascript
{renderSection("🆕 New Components", (
  <>
    <Text style={styles.componentTitle}>New Component</Text>
    <NewComponent
      prop1="value"
      prop2={newComponentState}
      onPress={() => setNewComponentState(!newComponentState)}
    />
  </>
))}
```

### Customizing Demo Content

Modify the demo data to match your specific use cases:

```javascript
const dropdownData = [
  // Add your specific options
  { label: "Custom Option", value: "custom" },
];

const countryData = [
  // Add your supported countries
  { countryName: "Your Country", idCountry: "YC", flag: "🏳️" },
];
```

## 📊 Testing Checklist

Use this checklist to validate component functionality:

### ✅ Button Components
- [ ] Primary buttons trigger actions
- [ ] Loading states display correctly
- [ ] Disabled states prevent interaction
- [ ] Icons display properly
- [ ] Navigation bar responds to taps

### ✅ Input Components
- [ ] Text inputs accept and display text
- [ ] Validation messages appear for errors
- [ ] Search functionality works
- [ ] Placeholder text displays correctly

### ✅ Selection Components
- [ ] Checkboxes toggle on/off
- [ ] Radio buttons allow single selection
- [ ] Visual feedback is immediate
- [ ] Disabled states work correctly

### ✅ Dropdown Components
- [ ] Options display when opened
- [ ] Selection updates component state
- [ ] Multiple selection works (when applicable)
- [ ] Search filtering works (if enabled)

### ✅ Utility Components
- [ ] Loading indicators animate
- [ ] Conditional rendering works
- [ ] Notifications appear/disappear
- [ ] Tab navigation functions

## 🚀 Development Tips

### Hot Reloading
The demo screen supports hot reloading for rapid development:
- Component changes reflect immediately
- State is preserved during hot reload
- Styling updates appear instantly

### Debugging
Use the demo screen for debugging:
- Add console.log statements to component handlers
- Test edge cases and error conditions
- Verify component prop validation
- Check performance with complex state

### Testing Different Scenarios
- **Network States**: Test loading and error states
- **Data States**: Test with empty, partial, and full data
- **User Interactions**: Test rapid tapping and edge cases
- **Accessibility**: Test with screen readers and voice control

## 📱 Device Testing

Test the demo screen on different devices:
- **Phone Sizes**: Various screen sizes and orientations
- **Tablets**: Larger screen layouts
- **Accessibility**: VoiceOver/TalkBack compatibility
- **Performance**: Smooth scrolling and interactions

## 🛠 Troubleshooting

### Common Issues

1. **Import Errors**
   - Verify component paths are correct
   - Check that components export correctly
   - Ensure theme files are accessible

2. **Styling Issues**
   - Verify Colors.js imports
   - Check Metrics usage
   - Validate theme system integration

3. **State Issues**
   - Check useState implementations
   - Verify handler functions
   - Debug component prop flow

### Getting Help

If you encounter issues:
1. Check component documentation in their respective folders
2. Review component JSDoc comments
3. Verify theme system integration
4. Test individual components in isolation

---

**Ready to start testing your banking app components! 🚀**
