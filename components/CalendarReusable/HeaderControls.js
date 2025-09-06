import React from "react";

import PropTypes from "prop-types";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import ArrowDownSVG from "../../assets/icons/icon-chevron-down.svg";
import Controls from "./Controls";
import { Utils } from "./Utils";

export default function HeaderControls(props) {
  const {
    styles,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    onPressMonth,
    onPressYear,
    months,
    previousComponent,
    nextComponent,
    previousTitle,
    nextTitle,
    previousTitleStyle,
    nextTitleStyle,
    monthTitleStyle,
    yearTitleStyle,
    textStyle,
    restrictMonthNavigation,
    maxDate,
    minDate,
    headingLevel,
    monthYearHeaderWrapperStyle,
    headerWrapperStyle
  } = props;

  const MONTHS = months || Utils.MONTHS; // English Month Array
  const monthName = MONTHS[currentMonth];
  const year = currentYear;

  const disablePreviousMonth = restrictMonthNavigation && Utils.isSameMonthAndYear(minDate, currentMonth, currentYear);
  const disableNextMonth = restrictMonthNavigation && Utils.isSameMonthAndYear(maxDate, currentMonth, currentYear);

  const accessibilityProps = { accessibilityRole: "header" };

  if (Platform.OS === "web") {
    accessibilityProps["aria-level"] = headingLevel;
  }

  return (
    <View style={[styles.headerWrapper, headerWrapperStyle]}>
      <Controls
        disabled={disablePreviousMonth}
        label={previousTitle}
        component={previousComponent}
        onPressControl={onPressPrevious}
        styles={styles.previousContainer}
        textStyles={[styles.navButtonText, textStyle, previousTitleStyle]}
      />
      <View style={[styles.monthYearHeaderWrapper, monthYearHeaderWrapperStyle]}>
        <TouchableOpacity onPress={onPressMonth} style={{ flexDirection: "row", alignItems: "center", marginRight: 4 }}>
          <Text style={[styles.monthHeaderMainText, textStyle, monthTitleStyle]} {...accessibilityProps}>
            {monthName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressYear}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 4
          }}>
          <Text style={[styles.yearHeaderMainText, textStyle, yearTitleStyle]}>{year}</Text>
        </TouchableOpacity>
        <View>
          <ArrowDownSVG width={10} height={10} />
        </View>
      </View>
      <Controls
        disabled={disableNextMonth}
        label={nextTitle}
        component={nextComponent}
        onPressControl={onPressNext}
        styles={styles.nextContainer}
        textStyles={[styles.navButtonText, textStyle, nextTitleStyle]}
      />
    </View>
  );
}

HeaderControls.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
  onPressMonth: PropTypes.func,
  onPressYear: PropTypes.func
};
