import React from "react";

import { Platform, View } from "react-native";

import Colors from "../../themes/Colors";
import { viewportHeight } from "../../utils/StyleHelpers";

/**
 * CustomContainer component to provide a customizable container with theme support.
 *
 * @param {object} props - The properties object.
 * @param {object} props.style - Additional styles for the container.
 * @param {React.Node} props.children - The children components to be rendered inside the container.
 * @param {string} props.backgroundColor - Custom background color for the container.
 * @param {number} props.padding - Custom padding for the container.
 * @param {number} props.margin - Custom margin for the container.
 * @param {number} props.borderRadius - Custom border radius for the container.
 * @returns {React.Node} The rendered CustomContainer component.
 */

const CustomContainer = (props) => {
  const { style = {}, children, backgroundColor = Colors.background, padding, margin, borderRadius } = props;

  const theme = {
    flex: 1,
    height: Platform.OS === Platform.IOS ? viewportHeight : viewportHeight - 20,
    backgroundColor: backgroundColor || Colors.background,
    padding,
    margin,
    borderRadius
  };

  return <View style={[style, theme]}>{children}</View>;
};

export default CustomContainer;
