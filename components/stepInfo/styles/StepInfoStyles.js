import { StyleSheet } from "react-native";

import Colors from "../../../themes/Colors";
import { IS_IOS } from "../../../utils/StyleHelpers";

export const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 16,
    marginBottom: 20
  },
  textContainer: {
    marginLeft: 16
  },
  circleStep: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start"
  },
  circleText: {
    color: Colors.white,
    fontSize: 16
  },
  title: {
    fontSize: 16,
    fontWeight: IS_IOS ? "500" : "bold"
  },
  subTitle: {
    fontSize: 16,
    fontWeight: IS_IOS ? "400" : "normal"
  },
  textStep: {
    fontSize: 16
  },
  // Progress bar styles
  progressBar: {
    height: 8,
    width: "100%",
    borderRadius: 5
  },
  progress: {
    height: "100%",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  }
});
