import React from "react";

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";
import StyleUtils from "../../utils/StyleUtils";

/**
 * PRIMARY ACTION BUTTON - Main call-to-action button for forms and primary user actions
 * 
 * **PURPOSE**: Used for primary actions like form submissions, confirmations, and main CTAs.
 * This button has prominent styling with full background color and is designed to be 
 * the most important action on a screen.
 * 
 * **WHEN TO USE**:
 * - Form submissions (Login, Register, Save, etc.)
 * - Primary confirmations (Confirm Purchase, Submit Application)
 * - Main CTAs (Get Started, Continue, Next Step)
 * 
 * **VISUAL CHARACTERISTICS**:
 * - Full background color (primary blue)
 * - White text
 * - Rounded corners (borderRadius: 100)
 * - Icons left or right of text
 * - Loading state with spinner
 * - Disabled state with reduced opacity
 * 
 * @component
 * @example
 * // Basic usage
 * <ReusableButton
 *   titleButton="Submit Application"
 *   onPressActionButton={handleSubmit}
 * />
 * 
 * @example
 * // With icon and loading
 * <ReusableButton
 *   titleButton="Save Changes"
 *   onPressActionButton={handleSave}
 *   loading={isSubmitting}
 *   iconButton={<SaveIcon />}
 *   iconPosition={0}
 * />
 * 
 * @param {object} props - Component properties
 * @param {string} props.titleButton - Text displayed on the button
 * @param {function} props.onPressActionButton - Function executed when button is pressed
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {object} [props.buttonStyle] - Custom styles for the button container
 * @param {object} [props.textButtonStyle] - Custom styles for the button text
 * @param {boolean} [props.loading=false] - Whether to show loading spinner
 * @param {React.Element} [props.iconButton] - Icon component to display
 * @param {object} [props.iconStyle] - Custom styles for the icon container
 * @param {number} [props.iconPosition=0] - Icon position (0=left, 1=right)
 * @param {boolean} [props.showIcon=true] - Whether to show the icon
 * @param {string} [props.accessibilityLabel] - Accessibility label
 * @param {object} [props.hitSlop] - Expands touchable area around button
 * @param {number} [props.activeOpacity=0.8] - Opacity when pressed
 * @returns {React.Element} Primary action button component
 */
const ReusableButton = ({
  titleButton,
  onPressActionButton,
  disabled,
  buttonStyle,
  textButtonStyle,
  loading,
  iconButton,
  iconStyle,
  iconPosition,
  showIcon,
  accessibilityLabel,
  hitSlop,
  activeOpacity
}) => (
  <TouchableOpacity
    onPress={loading || disabled ? null : onPressActionButton}
    disabled={disabled || loading}
    accessibilityLabel={accessibilityLabel}
    hitSlop={hitSlop}
    activeOpacity={activeOpacity}>
    <View style={[styles.container, buttonStyle, disabled && styles.disabledContainer, {}]}>
      {loading ? (
        <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />
      ) : (
        <View style={styles.textContainer}>
          {showIcon && iconPosition === 0 && <View style={[styles.iconButtonStyle, iconStyle]}>{iconButton}</View>}
          <Text style={[styles.textButton, textButtonStyle]}>{titleButton}</Text>
          {showIcon && iconPosition === 1 && <View style={[styles.iconButtonStyle, iconStyle]}>{iconButton}</View>}
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: Colors.primary[300],
    paddingVertical: 14,
    marginBottom: 8,
    borderRadius: 100,
    alignItems: "center"

    // elevation: 1, // para Android
    // shadowColor: Colors.black, // para iOS
    // shadowOffset: { width: 0, height: 1 }, // para iOS
    // shadowOpacity: 0.2, // para iOS
    // shadowRadius: 2 // para iOS
  },
  textContainer: {
    flexDirection: "row"
  },
  iconButtonStyle: {
    marginHorizontal: 5
  },
  textButton: {
    color: "white",
    fontFamily: "Roboto",
    fontSize: StyleUtils.fontSizeByFontScale(0.7, 0.7),
    fontWeight: IS_IOS ? "500" : "bold",
    textAlign: "center"
  },
  disabledContainer: {
    opacity: 0.5
  },
  loadingIndicator: {
    marginRight: 10
  }
});

ReusableButton.defaultProps = {
  disabled: false,
  loading: false,
  iconButton: null,
  iconPosition: 0,
  showIcon: true,
  accessibilityLabel: "",
  hitSlop: { top: 0, bottom: 0, left: 0, right: 0 },
  activeOpacity: 0.8,
  onPressActionButton: () => {
    console.log("botón presionado");
  }
};

export default ReusableButton;
