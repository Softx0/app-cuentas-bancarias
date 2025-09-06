import React, { useState } from "react";

import { View } from "react-native";

import ChevronLeftSVG from "../../assets/icons/icon-chevron-left.svg";
import ChevronRightSVG from "../../assets/icons/icon-chevron-right.svg";
import Colors from "../../themes/Colors.js";
import { Calendar } from "./Calendar.js";
import styles from "./styles/CalendarReusable.styles.js";


export const CalendarReusable = ({
  startDate,
  endDate,
  onApplyDates,
  cancelButton,
  minDate = new Date(new Date().getFullYear() - 1, 0, 1),
  maxDate = new Date(),
  containerStyle = styles.container,
  calendarContainerStyle = styles.calendarContainer,
  monthTitleStyle = styles.monthTitleStyle,
  textStyle = styles.textStyle,
  yearTitleStyle = styles.yearTitleStyle,
  todayBackgroundColor = styles.todayBackgroundColor,
  todayTextStyle = styles.todayTextStyle,
  selectedStartDateStyle = styles.selectedRangeStartStyle,
  selectedStartDateTextStyle = styles.selectedRangeStartTextStyle,
  selectedRangeStyle = styles.selectedRangeStyle,
  selectedDayTextStyle = styles.selectedDayTextStyle,
  selectedEndDateStyle = styles.selectedRangeEndStyle,
  selectedEndDateTextStyle = styles.selectedRangeEndTextStyle,
  previousTitleColor = Colors.neutral[500],
  nextTitleColor = Colors.neutral[500],
  weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
  months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  calendarWidth = styles.calendarWidth,
  enableDateRangeInputs = false,
  canBeSameDay = false
}) => {
  const oneDayInMillis = 24 * 60 * 60 * 1000;
  const oneWeekBack = new Date(Date.now() - oneDayInMillis);
  const oneWeekForward = new Date(Date.now() + oneDayInMillis * 7);
  const today = new Date();

  oneWeekBack.setDate(oneWeekBack.getDate() - 6);

  const oneYearAgo = new Date();

  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);

  const onDateChange = (date, type) => {
    if (type === "END_DATE") {
      setSelectedEndDate(date);
    } else if (canBeSameDay && endDate === startDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const handleApply = () => {
    onApplyDates(selectedStartDate, selectedEndDate);
  };

  return (
    <View style={containerStyle}>
      <View style={calendarContainerStyle}>
        <Calendar
          startFromMonday
          maxDate={maxDate}
          minDate={minDate}
          width={calendarWidth}
          dayLabelsWrapper={{ borderTopWidth: 0, borderBottomWidth: 0 }}
          monthTitleStyle={monthTitleStyle}
          textStyle={textStyle}
          yearTitleStyle={yearTitleStyle}
          todayBackgroundColor={todayBackgroundColor}
          todayTextStyle={todayTextStyle}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          selectedRangeStartStyle={selectedStartDateStyle}
          selectedRangeStartTextStyle={selectedStartDateTextStyle}
          selectedRangeStyle={selectedRangeStyle}
          selectedDayTextStyle={selectedDayTextStyle}
          selectedRangeEndStyle={selectedEndDateStyle}
          selectedRangeEndTextStyle={selectedEndDateTextStyle}
          allowRangeSelection
          allowBackwardRangeSelect
          applyButton={handleApply}
          cancelButton={cancelButton}
          disabledButton={!canBeSameDay && !selectedEndDate}
          previousTitle={<ChevronLeftSVG width={25} height={25} color={previousTitleColor} />}
          nextTitle={<ChevronRightSVG width={25} height={25} color={nextTitleColor} />}
          weekdays={weekdays}
          months={months}
          onDateChange={onDateChange}
          enableDateRangeInputs={enableDateRangeInputs}
          canBeSameDay={canBeSameDay}
        />
      </View>
    </View>
  );
};
