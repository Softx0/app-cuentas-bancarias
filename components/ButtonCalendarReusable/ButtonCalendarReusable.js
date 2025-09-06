import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import {
  bewareHierarchyStyle,
  commonStyles,
  fullRadiusStyle,
  ghostHierarchyStyle,
  largeSizeStyle,
  mediumSizeStyle,
  primaryHierarchyStyle,
  roundedStyle,
  secondaryGrayHierarchyStyle,
  secondaryHierarchyStyle,
  smallSizeStyle
} from "./ButtonCalendarReusableStyles";

/** @type {Record<ButtonCalendarReusableHierarchy, Object>} */
const HIERARCHY_STYLES = {
  primary: primaryHierarchyStyle,
  secondary: secondaryHierarchyStyle,
  secondaryGray: secondaryGrayHierarchyStyle,
  ghost: ghostHierarchyStyle,
  beware: bewareHierarchyStyle
};

/** @type {Record<ButtonCalendarReusableSize, Object>} */
const SIZE_STYLES = {
  small: smallSizeStyle,
  medium: mediumSizeStyle,
  large: largeSizeStyle
};

/** @type {Record<ButtonCalendarReusableStyle, Object} */
const STYLE_STYLES = {
  "full-radius": fullRadiusStyle,
  rounded: roundedStyle
};

/** @type {ButtonCalendarReusableHierarchy} */
const DEFAULT_HIERARCHY = "primary";
/** @type {ButtonCalendarReusableStyle} */
const DEFAULT_STYLE = "full-radius";
/** @type {ButtonCalendarReusableSize} */
const DEFAULT_SIZE = "medium";

/**
 * Component for buttons
 * @param {ButtonCalendarReusableProps} props
 * @returns
 */
export const ButtonCalendarReusable = (props) => {
  /** @type {ButtonCalendarReusableProps} */
  const _props = {
    hierarchy: DEFAULT_HIERARCHY,
    style: DEFAULT_STYLE,
    size: DEFAULT_SIZE,
    ...props
  };

  const sizeStyle = SIZE_STYLES[_props.size];
  const styleStyle = STYLE_STYLES[_props.style];
  const hierarchyStyle = HIERARCHY_STYLES[_props.hierarchy];

  const _containerStyle = {
    ...commonStyles?.container,
    ...sizeStyle?.container,
    ...styleStyle?.container,
    ...hierarchyStyle?.container,
    ...props.containerStyle,
    ...{ opacity: _props.disabled ? 0.5 : 1 }
  };

  const _labelTextStyle = {
    ...commonStyles?.labelText,
    ...sizeStyle?.labelText,
    ...hierarchyStyle?.labelText,
    ...sizeStyle?.labelText,
    ...props.labelStyle
  };

  const _innerContainerStyle = {
    ...commonStyles.innerContainer,
    ...sizeStyle.innerContainer
  };

  /**
   * Determines what to show in the button
   * @param {ButtonCalendarReusableProps} props Button props to determine what to show inside the button
   * @returns
   */
  const getButtonContent = ({ isLoading, label, buttonIcon: icon }) => {
    if (isLoading) {
      return <ActivityIndicator color={_labelTextStyle.color} size={20} />;
    }

    return (
      <View style={_innerContainerStyle}>
        {icon?.position === "left" && <View style>{icon.icon}</View>}
        <Text style={_labelTextStyle}>{label}</Text>
        {icon?.position === "right" && <View>{icon.icon}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      testID={_props.testID}
      style={_containerStyle}
      disabled={_props.disabled}
      activeOpacity={_props.isLoading ? 1 : 0.2}
      onPress={() => !_props.isLoading && _props?.onPress?.()}>
      {getButtonContent(_props)}
    </TouchableOpacity>
  );
};
