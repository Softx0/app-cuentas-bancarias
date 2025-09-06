/**
 * Calendar Picker Component
 *
 * Copyright 2016 Yahoo Inc.
 * Licensed under the terms of the MIT license. See LICENSE file in the project root for terms.
 */
const DEFAULT_SELECTED_BACKGROUND_COLOR = "#5ce600";
const DEFAULT_SELECTED_TEXT_COLOR = "#000000";
const DEFAULT_TODAY_BACKGROUND_COLOR = "#CCCCCC";

function getBorderRadiusByShape(scaler, dayShape) {
  if (dayShape === "square") {
    return 0;
  }

  return 30 * scaler;
}

export function makeStyles(params) {
  const { containerWidth, containerHeight, scaleFactor, selectedDayColor, selectedDayTextColor, todayBackgroundColor, dayShape } = params;
  const scaler = Math.min(containerWidth, containerHeight) / scaleFactor;
  const SELECTED_BG_COLOR = selectedDayColor ? selectedDayColor : DEFAULT_SELECTED_BACKGROUND_COLOR;
  const SELECTED_TEXT_COLOR = selectedDayTextColor ? selectedDayTextColor : DEFAULT_SELECTED_TEXT_COLOR;
  const TODAY_BG_COLOR = todayBackgroundColor ? todayBackgroundColor : DEFAULT_TODAY_BACKGROUND_COLOR;

  return {
    containerWidth,
    containerHeight,

    calendar: {
      height: 200 * scaler,
      marginTop: 10 * scaler
    },

    dayButton: {
      width: 40 * scaler,
      height: 40 * scaler,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: "center",
      justifyContent: "center"
    },

    dayLabel: {
      fontSize: 16 * scaler,
      color: "#000",
      alignSelf: "center"
    },

    selectedDayLabel: {
      color: SELECTED_TEXT_COLOR
    },

    dayLabelsWrapper: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderTopWidth: 1,
      paddingVertical: 20 * scaler,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      borderColor: "rgba(0,0,0,0.2)"
    },

    daysWrapper: {
      alignSelf: "center",
      justifyContent: "center"
    },

    dayLabels: {
      width: 50 * scaler,
      fontSize: 16 * scaler,
      color: "#464C5E",
      textAlign: "center"
    },

    selectedDay: {
      width: 35 * scaler,
      height: 35 * scaler,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: "center",
      justifyContent: "center"
    },

    selectedDayBackground: {
      backgroundColor: SELECTED_BG_COLOR
    },

    selectedToday: {
      width: 50 * scaler,
      height: 50 * scaler,
      backgroundColor: TODAY_BG_COLOR,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: "center",
      justifyContent: "center"
    },

    todayDot: {
      width: 6 * scaler,
      height: 6 * scaler,
      borderRadius: 3 * scaler,
      backgroundColor: "#009ED4",
      alignSelf: "center",
      marginTop: 2 * scaler
    },

    dayWrapper: {
      alignItems: "center",
      justifyContent: "center",
      width: 55 * scaler,
      height: 55 * scaler,
      backgroundColor: "#FFFFFF"
    },

    startDayWrapper: {
      width: 50 * scaler,
      height: 50 * scaler,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: "center",
      justifyContent: "center"
    },

    endDayWrapper: {
      width: 50 * scaler,
      height: 50 * scaler,
      borderRadius: getBorderRadiusByShape(scaler, dayShape),
      alignSelf: "center",
      justifyContent: "center"
    },

    inRangeDay: {
      width: 60 * scaler,
      height: 50 * scaler,
      backgroundColor: SELECTED_BG_COLOR,
      alignSelf: "center",
      justifyContent: "center"
    },

    headerWrapper: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "space-between",
      width: containerWidth,
      padding: 15 * scaler,
      paddingBottom: 3 * scaler,
      marginBottom: 10 * scaler,
      backgroundColor: "#FFFFFF"
    },

    monthYearHeaderWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 3 * scaler
    },

    previousContainer: {
      marginLeft: 10 * scaler,
      backgroundColor: "#FFFFFF"
    },

    nextContainer: {
      marginRight: 10 * scaler,
      alignItems: "flex-end",
      backgroundColor: "#FFFFFF"
    },

    navButtonText: {
      fontSize: 16 * scaler
    },

    weeks: {
      flexDirection: "column"
    },

    weekRow: {
      flexDirection: "row"
    },

    disabledText: {
      fontSize: 16 * scaler,
      color: "#BBBBBB",
      alignSelf: "center",
      justifyContent: "center"
    },

    selectedDisabledText: {
      fontSize: 16 * scaler,
      color: "#DDDDDD",
      alignSelf: "center",
      justifyContent: "center"
    },

    monthHeaderMainText: {
      fontSize: 16 * scaler,
      color: "#000",
      textAlign: "right",
      marginHorizontal: 3 * scaler
    },

    monthButton: {
      width: 30 * scaler,
      height: 30 * scaler,
      borderRadius: 30 * scaler,
      alignSelf: "center",
      justifyContent: "center"
    },

    monthsHeaderText: {
      flex: 1,
      fontSize: 16 * scaler,
      color: "#464C5E",
      textAlign: "center"
    },

    monthContainer: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "#FFFFFF"
    },

    monthText: {
      fontSize: 16 * scaler,
      color: "#000",
      alignSelf: "center"
    },

    monthsWrapper: {
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      width: containerWidth
    },

    monthsRow: {
      flexDirection: "row",
      padding: 20 * scaler,
      backgroundColor: "#FFFFFF"
    },

    yearHeaderMainText: {
      fontSize: 16 * scaler,
      color: "#000",
      backgroundColor: "#FFFFFF",
      marginHorizontal: 3 * scaler
    },

    yearContainer: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "#FFFFFF"
    },

    yearText: {
      fontSize: 16 * scaler,
      color: "#000",
      alignSelf: "center",
      backgroundColor: "#FFFFFF"
    },

    yearsHeaderText: {
      fontSize: 16 * scaler,
      color: "#000",
      backgroundColor: "#FFFFFF",
      width: 180 * scaler,
      textAlign: "center"
    },

    yearsWrapper: {
      alignSelf: "center",
      justifyContent: "center",
      width: containerWidth
    },

    yearsRow: {
      flexDirection: "row",
      padding: 25 * scaler,
      backgroundColor: "#FFFFFF"
    },
    lastElementInRowInRange: {
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      overflow: "hidden"
    },
    firstElementInRowInRange: {
      borderTopLeftRadius: 25,
      borderBottomLeftRadius: 25,
      overflow: "hidden"
    }
  };
}
