import React from "react";

import { differenceInDays } from "date-fns/differenceInDays";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { isSameDay } from "date-fns/isSameDay";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { startOfDay } from "date-fns/startOfDay";
import PropTypes from "prop-types";
import { Text, TouchableOpacity, View } from "react-native";

export default function Day(props) {
  const {
    day,
    month,
    year,
    styles,
    customDatesStyles = [],
    onPressDay,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    allowBackwardRangeSelect,
    selectedDayStyle: propSelectedDayStyle,
    selectedDisabledDatesTextStyle,
    selectedRangeStartStyle,
    selectedRangeStyle,
    selectedRangeEndStyle,
    textStyle,
    todayTextStyle,
    selectedDayTextStyle: propSelectedDayTextStyle,
    selectedRangeStartTextStyle,
    selectedRangeEndTextStyle,
    minDate,
    maxDate,
    disabledDates,
    disabledDatesTextStyle,
    minRangeDuration,
    maxRangeDuration,
    enableDateChange,
    firstElementInRow,
    lastElementInRow
  } = props;

  const thisDay = new Date(year, month, day, 12);
  const today = new Date();

  let currentDayGrid;
  let computedSelectedDayStyle = styles.dayButton; // may be overridden depending on state
  let selectedDayTextStyle = {};
  let selectedDayStyle;
  let overrideOutOfRangeTextStyle;
  let dateIsBeforeMin = false;
  let dateIsAfterMax = false;
  let dateIsDisabled = false;
  let dateRangeLessThanMin = false;
  let dateRangeGreaterThanMax = false;

  // First let's check if date is out of range
  // Check whether props maxDate / minDate are defined. If not supplied,
  // don't restrict dates.
  if (maxDate) {
    dateIsAfterMax = isAfter(startOfDay(thisDay), startOfDay(maxDate));
  }

  if (minDate) {
    dateIsBeforeMin = isBefore(startOfDay(thisDay), startOfDay(minDate));
  }

  if (disabledDates) {
    if (Array.isArray(disabledDates) && disabledDates.indexOf(thisDay.valueOf()) >= 0) {
      dateIsDisabled = true;
    } else if (disabledDates instanceof Function) {
      dateIsDisabled = disabledDates(thisDay);
    }
  }

  if (allowRangeSelection && selectedStartDate && !selectedEndDate) {
    let daysDiff = differenceInDays(thisDay, selectedStartDate); // may be + or -

    daysDiff = allowBackwardRangeSelect ? Math.abs(daysDiff) : daysDiff;

    if (maxRangeDuration) {
      if (Array.isArray(maxRangeDuration)) {
        const maxRangeEntry = maxRangeDuration.find((mrd) => isSameDay(selectedStartDate, mrd.date));

        if (maxRangeEntry && daysDiff > maxRangeEntry.maxDuration) {
          dateRangeGreaterThanMax = true;
        }
      } else if (daysDiff > maxRangeDuration) {
        dateRangeGreaterThanMax = true;
      }
    }

    if (minRangeDuration) {
      if (Array.isArray(minRangeDuration)) {
        const minRangeEntry = minRangeDuration.find((mrd) => isSameDay(selectedStartDate, mrd.date));

        if (minRangeEntry && daysDiff < minRangeEntry.minDuration) {
          dateRangeLessThanMin = true;
        }
      } else if (daysDiff < minRangeDuration) {
        dateRangeLessThanMin = true;
      }
    }

    if (!allowBackwardRangeSelect && daysDiff < 0) {
      dateRangeLessThanMin = true;
    }
  }

  const dateOutOfRange = dateIsAfterMax || dateIsBeforeMin || dateIsDisabled || dateRangeLessThanMin || dateRangeGreaterThanMax;

  const isThisDaySameAsSelectedStart = isSameDay(thisDay, selectedStartDate);
  const isThisDaySameAsSelectedEnd = isSameDay(thisDay, selectedEndDate);
  const isThisDateInSelectedRange =
    selectedStartDate &&
    selectedEndDate &&
    isWithinInterval(thisDay, {
      start: selectedStartDate,
      end: selectedEndDate
    });

  // If date is in range let's apply styles
  if (!dateOutOfRange || isThisDaySameAsSelectedStart || isThisDaySameAsSelectedEnd || isThisDateInSelectedRange) {
    // set today's style
    const isToday = isSameDay(thisDay, today);

    if (isToday) {
      computedSelectedDayStyle = styles.selectedToday;
      // todayTextStyle prop overrides selectedDayTextColor (created via makeStyles)
      selectedDayTextStyle = [todayTextStyle || styles.selectedDayLabel, propSelectedDayTextStyle];
    }

    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });

    if (isToday && custom.style) {
      // Custom date style overrides 'today' style. It may be reset below
      // by date selection styling.
      computedSelectedDayStyle = [styles.selectedToday, custom.style];
    }

    // set selected day style
    if (!allowRangeSelection && selectedStartDate && isThisDaySameAsSelectedStart) {
      computedSelectedDayStyle = styles.selectedDay;
      selectedDayTextStyle = [styles.selectedDayLabel, isToday && todayTextStyle, propSelectedDayTextStyle];
      // selectedDayStyle prop overrides selectedDayColor (created via makeStyles)
      selectedDayStyle = propSelectedDayStyle || styles.selectedDayBackground;
    }

    // Set selected ranges styles
    if (allowRangeSelection) {
      if (selectedStartDate && selectedEndDate) {
        // Apply style for start date
        if (isThisDaySameAsSelectedStart) {
          computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        }

        // Apply style for end date
        if (isThisDaySameAsSelectedEnd) {
          computedSelectedDayStyle = [styles.endDayWrapper, selectedRangeStyle, selectedRangeEndStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeEndTextStyle];
        }

        // Apply style if start date is the same as end date
        if (isThisDaySameAsSelectedEnd && isThisDaySameAsSelectedStart && isSameDay(selectedEndDate, selectedStartDate)) {
          computedSelectedDayStyle = [styles.selectedDay, styles.selectedDayBackground, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        }

        // Apply style for days inside of range, excluding start & end dates.
        if (!isThisDaySameAsSelectedEnd && !isThisDaySameAsSelectedStart && isWithinInterval(thisDay, { start: selectedStartDate, end: selectedEndDate })) {
          computedSelectedDayStyle = [styles.inRangeDay, selectedRangeStyle];
          selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle];
        }
      }

      // Apply style if start date has been selected but end date has not
      if (selectedStartDate && !selectedEndDate && isThisDaySameAsSelectedStart) {
        computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
        selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
        // Override out of range start day text style when minRangeDuration = 1.
        // This allows selected start date's text to be styled by selectedRangeStartTextStyle
        // even when it's below minRangeDuration.
        overrideOutOfRangeTextStyle = selectedRangeStartTextStyle;
      }
    }

    if (selectedStartDate && isThisDaySameAsSelectedStart) {
      computedSelectedDayStyle = [styles.startDayWrapper, selectedRangeStyle, selectedRangeStartStyle];
      selectedDayTextStyle = [styles.selectedDayLabel, propSelectedDayTextStyle, selectedRangeStartTextStyle];
    }

    if (dateOutOfRange) {
      // start or end date selected, and this date outside of range.
      currentDayGrid = (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          <View style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}>
            <Text
              style={[
                styles.dayLabel,
                textStyle,
                styles.disabledText,
                disabledDatesTextStyle,
                styles.selectedDisabledText,
                selectedDisabledDatesTextStyle,
                overrideOutOfRangeTextStyle
              ]}>
              {day}
            </Text>
          </View>
        </View>
      );
    } else {
      currentDayGrid = (
        <View style={[styles.dayWrapper, custom.containerStyle]}>
          {selectedStartDate &&
          selectedEndDate &&
          !isSameDay(selectedEndDate, selectedStartDate) &&
          (isThisDaySameAsSelectedEnd || isThisDaySameAsSelectedStart) ? (
            <View style={{ position: "absolute", flexDirection: "row", width: "100%", height: styles.inRangeDay.height }}>
              <View style={{ flex: 1, backgroundColor: isThisDaySameAsSelectedEnd ? selectedRangeStyle?.backgroundColor : "" }} />
              <View style={{ flex: 1, backgroundColor: isThisDaySameAsSelectedStart ? selectedRangeStyle?.backgroundColor : "" }} />
            </View>
          ) : null}
          <TouchableOpacity
            disabled={!enableDateChange}
            style={[custom.style, computedSelectedDayStyle, selectedDayStyle]}
            onPress={() => onPressDay({ year, month, day })}>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.dayLabel, textStyle, custom.textStyle, selectedDayTextStyle]}>{day}</Text>
              {isToday && <View style={styles.todayDot} />}
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  } else {
    // dateOutOfRange = true, and no selected start or end date.
    const custom = getCustomDateStyle({ customDatesStyles, date: thisDay });
    const isToday = isSameDay(thisDay, today);

    // Allow customDatesStyles to override disabled dates if allowDisabled set
    if (!custom.allowDisabled) {
      custom.containerStyle = null;
      custom.style = null;
      custom.textStyle = null;
    }

    currentDayGrid = (
      <View style={[styles.dayWrapper, custom.containerStyle]}>
        <View style={[styles.dayButton, custom.style]}>
          <View style={{ alignItems: "center" }}>
            <Text style={[textStyle, styles.disabledText, disabledDatesTextStyle, custom.textStyle]}>{day}</Text>
            {isToday && <View style={styles.todayDot} />}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ ...(firstElementInRow ? styles.firstElementInRowInRange : {}), ...(lastElementInRow ? styles.lastElementInRowInRange : {}) }}>
      {currentDayGrid}
    </View>
  );
}

function getCustomDateStyle({ customDatesStyles, date }) {
  if (Array.isArray(customDatesStyles)) {
    for (const cds of customDatesStyles) {
      if (isSameDay(date, new Date(cds.date))) {
        return { ...cds };
      }
    }
  } else if (customDatesStyles instanceof Function) {
    const cds = customDatesStyles(date) || {};

    return { ...cds };
  }

  return {};
}

Day.propTypes = {
  styles: PropTypes.shape({}),
  day: PropTypes.number,
  onPressDay: PropTypes.func,
  disabledDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  minRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  maxRangeDuration: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};
