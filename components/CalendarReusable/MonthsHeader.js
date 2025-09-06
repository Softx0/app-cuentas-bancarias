import React from "react";

import PropTypes from "prop-types";
import { Platform, Text, View } from "react-native";

import { stylePropType } from "./localPropTypes";

export default function MonthsHeader(props) {
  const { styles, textStyle, headingLevel, title } = props;

  const accessibilityProps = { accessibilityRole: "header" };

  if (Platform.OS === "web") {
    accessibilityProps["aria-level"] = headingLevel;
  }

  return (
    <View style={styles.headerWrapper}>
      <Text style={[styles.monthsHeaderText, textStyle]}>{title}</Text>
    </View>
  );
}

MonthsHeader.propTypes = {
  styles: stylePropType,
  textStyle: stylePropType,
  title: PropTypes.string
};
