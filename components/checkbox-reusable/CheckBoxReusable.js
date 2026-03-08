/**
 * CheckBoxReusable - Custom checkbox component
 * 
 * This component provides a complete replacement for react-native-elements CheckBox
 * using only React Native native components. It maintains full API compatibility
 * for seamless integration with existing code.
 */
import React, { useCallback, useMemo } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Custom CheckBox component that replicates react-native-elements CheckBox functionality
 * using only React Native native components.
 * 
 * @component
 * @example
 * // Basic usage
 * <CheckBoxReusable
 *   title="Accept Terms"
 *   checked={isAccepted}
 *   onPress={() => setIsAccepted(!isAccepted)}
 *   checkedIcon={<CheckedIcon />}
 *   uncheckedIcon={<UncheckedIcon />}
 * />
 * 
 * @example
 * // With custom styling and right-aligned icon
 * <CheckBoxReusable
 *   title="Remember Me"
 *   checked={remember}
 *   onPress={handleToggle}
 *   checkedIcon={<CustomCheckedIcon />}
 *   uncheckedIcon={<CustomUncheckedIcon />}
 *   iconRight={true}
 *   textStyle={{ fontSize: 16, color: 'blue' }}
 *   containerStyle={{ padding: 10 }}
 *   disabled={isLoading}
 * />
 * 
 * @param {Object} props - Component properties
 * @param {string} [props.title] - Text to display next to the checkbox
 * @param {boolean} [props.checked=false] - Whether the checkbox is checked
 * @param {function} [props.onPress] - Function called when checkbox is pressed
 * @param {React.ReactNode} [props.checkedIcon] - Icon to show when checked
 * @param {React.ReactNode} [props.uncheckedIcon] - Icon to show when unchecked
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled
 * @param {Object|Array} [props.textStyle] - Custom styles for the text
 * @param {Object|Array} [props.containerStyle] - Custom styles for the container
 * @param {boolean} [props.iconRight=false] - Whether to position icon on the right
 * @param {boolean} [props.accessible=true] - Whether the component is accessible
 * @param {string} [props.accessibilityRole="checkbox"] - Accessibility role
 * @param {Object} [props.accessibilityState] - Additional accessibility state
 * @param {string} [props.accessibilityLabel] - Accessibility label
 * @param {string} [props.accessibilityHint] - Accessibility hint
 * @param {Object} [props.hitSlop] - Hit slop for touch area
 * @param {number} [props.activeOpacity=0.7] - Opacity when pressed
 * @returns {React.ReactElement} CheckBox component
 */
const CheckBoxReusable = ({
  title,
  checked = false,
  onPress,
  checkedIcon,
  uncheckedIcon,
  disabled = false,
  textStyle,
  containerStyle,
  iconRight = false,
  accessible = true,
  accessibilityRole = "checkbox",
  accessibilityState,
  accessibilityLabel,
  accessibilityHint,
  hitSlop,
  activeOpacity = 0.7,
  ...restProps
}) => {
  // Optimized press handler
  const handlePress = useCallback(() => {
    if (!disabled && typeof onPress === "function") {
      console.log("CheckBoxReusable pressed:", JSON.stringify({ checked: !checked, title }, null, 2));
      onPress();
    }
  }, [disabled, onPress, checked, title]);

  // Memoized current icon based on checked state
  const currentIcon = useMemo(() => {
    return checked ? checkedIcon : uncheckedIcon;
  }, [checked, checkedIcon, uncheckedIcon]);

  // Memoized accessibility state
  const accessibilityStateComputed = useMemo(() => ({
    checked,
    disabled,
    ...accessibilityState
  }), [checked, disabled, accessibilityState]);

  // Memoized container styles
  const containerStyles = useMemo(() => [
    styles.container,
    disabled && styles.disabledContainer,
    containerStyle
  ], [disabled, containerStyle]);

  // Memoized text styles
  const textStyles = useMemo(() => [
    styles.title,
    disabled && styles.disabledText,
    textStyle
  ], [disabled, textStyle]);

  // Default accessibility label if not provided
  const defaultAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;
    if (title) return `${title}, ${checked ? "seleccionado" : "no seleccionado"}`;
    return checked ? "Seleccionado" : "No seleccionado";
  }, [accessibilityLabel, title, checked]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityStateComputed}
      accessibilityLabel={defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      hitSlop={hitSlop}
      activeOpacity={activeOpacity}
      style={containerStyles}
      {...restProps}
    >
      <View style={styles.checkboxContainer}>
        {/* Icon on the left */}
        {!iconRight && currentIcon && (
          <View style={styles.iconContainer}>
            {currentIcon}
          </View>
        )}
        
        {/* Title/Label text */}
        {title && (
          <Text style={textStyles}>
            {title}
          </Text>
        )}
        
        {/* Icon on the right */}
        {iconRight && currentIcon && (
          <View style={styles.iconContainer}>
            {currentIcon}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Styles that match react-native-elements CheckBox behavior
const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: "transparent",
    margin: 0,
    padding: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  disabledContainer: {
    opacity: 0.5
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  iconContainer: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontFamily: "SF Pro",
    fontSize: IS_IOS ? 15 : 15,
    fontWeight: "500",
    color: Colors.textPrimary || "#000",
    flex: 1
  },
  disabledText: {
    color: Colors.textSecondary || "#999"
  }
});

export default CheckBoxReusable;
