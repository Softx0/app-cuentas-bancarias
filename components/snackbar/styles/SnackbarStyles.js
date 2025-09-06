import { StyleSheet } from "react-native";

import StyleUtils from "../../../utils/StyleUtils";

export const SnackbarStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0
  },

  snackBarContainerStyle: {
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    flexDirection: "row",
    left: 0,
    right: 0
  },

  messageTextStyle: {
    fontSize: StyleUtils.fontSizeByFontScale(0.62, 0.62),
    fontFamily: "Roboto",
    fontWeight: "400",
    marginLeft: 4,
    color: "white"
  },

  actionTextStyle: {
    marginLeft: 8,
    fontSize: 14
  },

  iconContainerStyle: {
    marginRight: 8
  }
});

export const SnackbarColors = {
  greenSuccess: "#31814D",
  redFailed: "#B01212"
};
