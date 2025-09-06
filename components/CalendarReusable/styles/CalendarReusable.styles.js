import { Dimensions, StyleSheet } from "react-native";

import Colors from "../../../themes/Colors";

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)" // Fondo oscuro
  },
  calendarContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D9E2"
  },
  monthTitleStyle: {
    color: Colors.primary[300],
    fontSize: 16
  },
  textStyle: {
    color: Colors.neutral[500],
    fontSize: 16
  },
  yearTitleStyle: {
    color: Colors.primary[300],
    fontSize: 16
  },
  todayBackgroundColor: "#EDEDF1",
  todayTextStyle: "#464C5E",
  selectedRangeStartStyle: {
    backgroundColor: "#009ED4"
  },
  selectedRangeStartTextStyle: {
    color: Colors.white
  },
  selectedRangeStyle: {
    backgroundColor: "#F6F7F9"
  },
  selectedDayTextStyle: {
    color: Colors.neutral[500]
  },
  selectedRangeEndStyle: {
    backgroundColor: "#009ED4"
  },
  selectedRangeEndTextStyle: {
    color: Colors.white
  },
  previousTitle: {
    color: Colors.neutral[500],
    size: 25
  },
  nextTitle: {
    color: Colors.neutral[500],
    size: 25
  },
  calendarWidth: screenWidth / 1.3
});

export default styles;
