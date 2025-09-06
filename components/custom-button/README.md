# Custom Button Components

## Overview

This folder contains three distinct button components, each designed for specific use cases in the banking application. Each button has a clear purpose and visual identity to maintain consistent UX patterns.

## Button Types

### 1. 🔵 **ReusableButton** - Primary Action Button
**File**: `ReusableButton.js`

**Purpose**: Main call-to-action button for forms and primary user actions.

**When to Use**:
- Form submissions (Login, Register, Save, etc.)
- Primary confirmations (Confirm Purchase, Submit Application)
- Main CTAs (Get Started, Continue, Next Step)

**Visual Characteristics**:
- Full background color (primary blue)
- White text
- Rounded corners (borderRadius: 100)
- Icons left or right of text
- Loading state with spinner
- Disabled state with reduced opacity

**Example**:
```jsx
<ReusableButton
  titleButton="Submit Application"
  onPressActionButton={handleSubmit}
  loading={isSubmitting}
/>
```

---

### 2. ⚪ **ButtonLiteReusable** - List/Menu Button
**File**: `ButtonLiteReusable.js`

**Purpose**: Subtle button for list items, menu options, and secondary actions.

**When to Use**:
- List items (Settings options, Menu items)
- Secondary actions (View Details, More Info)
- Filter/Sort options
- Navigation items in drawers/menus
- Form field buttons (Date picker, Dropdown triggers)

**Visual Characteristics**:
- White/transparent background
- Subtle border or no border
- Icons on left and/or right sides
- Text aligned left with icon spacing
- Different states for disabled/enabled icons
- Loading state with centered spinner
- Minimal padding and margins

**Example**:
```jsx
<ButtonLiteReusable
  text="Account Settings"
  onPress={navigateToSettings}
  leftIcon={<SettingsIcon />}
  showIconRight={true}
/>
```

---

### 3. 📱 **ButtonNavigationBarReusable** - Navigation Bar
**File**: `ButtonNavigationBarReusable.js`

**Purpose**: Multi-button navigation component for tab-based interfaces.

**When to Use**:
- Bottom tab navigation (Home, Profile, Settings, etc.)
- Action toolbars (Edit, Delete, Share, etc.)
- Multi-step form navigation
- Dashboard quick actions
- Document/media viewers with multiple tools

**Visual Characteristics**:
- Horizontal layout with equally spaced buttons
- Icons above or below text labels
- Active state indicator (blue underline bar)
- Loading states with spinners
- Disabled states with reduced opacity
- Flexible icon positioning
- Customizable styling per button

**Example**:
```jsx
const navButtons = [
  {
    titleButton: "Home",
    onPressActionButton: () => navigate('Home'),
    iconButton: <HomeIcon />
  },
  {
    titleButton: "Profile",
    onPressActionButton: () => navigate('Profile'), 
    iconButton: <ProfileIcon />
  }
];

<ButtonNavigationBarReusable 
  buttons={navButtons}
  showIndicator={true}
/>
```

## Design System Integration

All buttons integrate with the banking application's design system:

- **Colors**: Use the centralized `Colors.js` from `themes/Colors`
- **Typography**: Use `StyleUtils.fontSizeByFontScale()` for accessibility
- **Platform**: Use `IS_IOS` from `utils/StyleHelpers` for platform-specific styling

## Best Practices

### 1. Button Hierarchy
- **Use only ONE primary button** per screen (ReusableButton)
- **Use secondary buttons** for less important actions (ButtonLiteReusable)
- **Use navigation bars** for switching between views/modes

### 2. Visual Consistency
- Icons should be consistent in size and style
- Loading states should always be implemented for async actions
- Disabled states should be clearly distinguishable

### 3. Accessibility
- Always provide `accessibilityLabel` props
- Use appropriate `hitSlop` for touch targets
- Test with different font scales

### 4. Performance
- Use `StyleUtils.fontSizeByFontScale()` for responsive text sizing
- Implement loading states to provide user feedback
- Use appropriate `activeOpacity` values

## Migration Notes

If migrating from old button components:
1. **Primary actions** → Use `ReusableButton`
2. **List items/menus** → Use `ButtonLiteReusable`
3. **Navigation/tabs** → Use `ButtonNavigationBarReusable`

Each component is fully documented with JSDoc and includes comprehensive examples for easy integration.
