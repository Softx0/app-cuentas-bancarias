import { StyleSheet } from "react-native";
import Colors from "../../../themes/Colors";
import Metrics from "../../../themes/Metrics";
import { IS_IOS } from "../../../utils/StyleHelpers";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.mXl,
    backgroundColor: Colors.background,
    paddingLeft: IS_IOS ? null : 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.white,
    height: 50,
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SF Pro",
    color: Colors.neutral[600],
    paddingLeft: 0,
    marginLeft: 8
  },
  filterText: {
    textAlign: "center",
    paddingTop: 10
  },
  iconLeft: {
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingRight: 10
  },
  trashCan: {
    marginRight: Metrics.medium,
    backgroundColor: "transparent"
  },
  iconRight: {
    backgroundColor: "transparent"
  },
  iconSerch: {
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  titleBuscarStyles: { fontFamily: "SF Pro", color: "#475569", fontSize: 14 }
});
