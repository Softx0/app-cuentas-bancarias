import React from "react";

import PropTypes from "prop-types";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import DownloadIconDisabledSVG from "../../assets/icons/chevron-down-desable.svg";
import ChevronDownSVG from "../../assets/icons/chevron-down-mascota.svg";
import IconCotizacionConsulta from "../../assets/icons/moneda-blue.svg";
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";
import StyleUtils from "../../utils/StyleUtils";

/**
 * LIGHTWEIGHT LIST BUTTON - Subtle button for list items, menu options, and secondary actions
 * 
 * **PURPOSE**: Used for subtle interactive elements that don't require prominent styling.
 * This button appears more like a list item or menu option with minimal visual weight.
 * 
 * **WHEN TO USE**:
 * - List items (Settings options, Menu items)
 * - Secondary actions (View Details, More Info)
 * - Filter/Sort options
 * - Navigation items in drawers/menus
 * - Form field buttons (Date picker, Dropdown triggers)
 * 
 * **VISUAL CHARACTERISTICS**:
 * - White/transparent background
 * - Subtle border or no border
 * - Icons on left and/or right sides
 * - Text aligned left with icon spacing
 * - Different states for disabled/enabled icons
 * - Loading state with centered spinner
 * - Minimal padding and margins
 * 
 * @component
 * @example
 * // Basic list item button
 * <ButtonLiteReusable
 *   text="Account Settings"
 *   onPress={navigateToSettings}
 *   showIconRight={true}
 * />
 * 
 * @example
 * // Date picker trigger
 * <ButtonLiteReusable
 *   text="Select Date"
 *   onPress={openDatePicker}
 *   leftIcon={<CalendarIcon />}
 *   rightIcon={<ChevronDownIcon />}
 *   isDisabled={formLocked}
 * />
 * 
 * @param {object} props - Component properties
 * @param {function} props.onPress - Function to execute when button is pressed
 * @param {string} props.text - Button text content
 * @param {boolean} [props.isDisabled=false] - Whether the button is disabled
 * @param {boolean} [props.isLoading=false] - Whether to show loading spinner
 * @param {object} [props.buttonStyle] - Additional styles for button container
 * @param {object} [props.textStyle] - Additional styles for text
 * @param {boolean} [props.showIconLeft=true] - Whether to show left icon
 * @param {boolean} [props.showIconRight=true] - Whether to show right icon
 * @param {boolean} [props.showIconLeftDisable=true] - Whether to show left icon when disabled
 * @param {boolean} [props.showIconRightDisable=true] - Whether to show right icon when disabled
 * @param {React.Element} [props.leftIcon] - Custom left icon component
 * @param {React.Element} [props.leftIconDisabled] - Custom left icon for disabled state
 * @param {React.Element} [props.rightIcon] - Custom right icon component
 * @param {React.Element} [props.rightIconDisabled] - Custom right icon for disabled state
 * @param {number} [props.iconSize=20] - Size of the icons in pixels
 * @returns {React.Element} Lightweight list button component
 */

const ButtonLiteReusable = ({
  onPress,
  text,
  isDisabled,
  isLoading,
  buttonStyle,
  textStyle,
  showIconLeft = true,
  showIconRight = true,
  showIconLeftDisable = true,
  showIconRightDisable = true,
  leftIcon = null,
  leftIconDisabled = null,
  rightIcon = null,
  rightIconDisabled = null,
  iconSize = 20
}) => {
  const getTextMargin = () => {
    const iconSpace = iconSize + 34;
    const leftMargin = showIconLeft || (isDisabled && showIconLeftDisable) ? iconSpace : 20;
    const rightMargin = showIconRight || (isDisabled && showIconRightDisable) ? iconSpace : 20;

    return { left: leftMargin, right: rightMargin };
  };

  const getLeftIcon = () => {
    if (!showIconLeft && !(isDisabled && showIconLeftDisable)) return null;

    if (isDisabled) {
      if (!showIconLeftDisable) return null;

      return leftIconDisabled || <IconCotizacionConsulta width={iconSize} height={iconSize} />;
    }

    return leftIcon || <IconCotizacionConsulta width={iconSize} height={iconSize} />;
  };

  const getRightIcon = () => {
    if (!showIconRight && !(isDisabled && showIconRightDisable)) return null;

    if (isDisabled) {
      if (!showIconRightDisable) return null;

      return rightIconDisabled || <DownloadIconDisabledSVG width={iconSize} height={iconSize} />;
    }

    return rightIcon || <ChevronDownSVG width={iconSize} height={iconSize} />;
  };

  const textMargins = getTextMargin();

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled || isLoading}>
      <View style={[styles.buttonStyles, { backgroundColor: isDisabled || isLoading ? Colors.white : Colors.white }, buttonStyle]}>
        {isLoading ? (
          <View style={styles.loadingStyle}>
            <ActivityIndicator size="small" color={Colors.primary[300]} />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {(showIconLeft || (isDisabled && showIconLeftDisable)) && <View style={[styles.iconButton, styles.iconLeft]}>{getLeftIcon()}</View>}

            <Text
              style={[
                styles.TextButton,
                {
                  color: isDisabled ? Colors.neutral[400] : Colors.textPrimary,
                  marginLeft: textMargins.left,
                  marginRight: textMargins.right
                },
                textStyle
              ]}>
              {text}
            </Text>

            {(showIconRight || (isDisabled && showIconRightDisable)) && <View style={[styles.iconButton, styles.iconRight]}>{getRightIcon()}</View>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyles: {
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginVertical: 3,
    // borderBottomWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.white
    // borderColor: Colors.neutral[400]
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "flex-start"
  },
  iconButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  },
  iconLeft: {
    left: 4
  },
  iconRight: {
    right: 4
  },
  TextButton: {
    color: Colors.textPrimary,
    fontSize: IS_IOS ? StyleUtils.fontSizeByFontScale(0.65, 0.65) : StyleUtils.fontSizeByFontScale(0.6, 0.6),
    fontFamily: "SF Pro",
    fontWeight: "400"
  },
  loadingStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

ButtonLiteReusable.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  showIconLeft: PropTypes.bool,
  showIconRight: PropTypes.bool,
  showIconLeftDisable: PropTypes.bool,
  showIconRightDisable: PropTypes.bool,
  leftIcon: PropTypes.element,
  leftIconDisabled: PropTypes.element,
  rightIcon: PropTypes.element,
  rightIconDisabled: PropTypes.element,
  iconSize: PropTypes.number
};

ButtonLiteReusable.defaultProps = {
  isDisabled: false,
  isLoading: false,
  buttonStyle: {},
  textStyle: {},
  showIconLeft: true,
  showIconRight: true,
  showIconLeftDisable: true,
  showIconRightDisable: true,
  leftIcon: null,
  leftIconDisabled: null,
  rightIcon: null,
  rightIconDisabled: null,
  iconSize: 20,
  onPress: () => console.log("Button pressed")
};

export default ButtonLiteReusable;
