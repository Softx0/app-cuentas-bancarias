import { StyleSheet } from "react-native";

import Colors from "../../../themes/Colors";

export default StyleSheet.create({
  containerCheck: {
    paddingLeft: 10,
    paddingVertical: 8
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#475569",
    marginRight: 10
  },
  checkboxSelected: {
    backgroundColor: Colors.primary[300]
  },
  iconContainer: {
    alignItems: "center", // Alinea horizontalmente el icono dentro del contenedor
    bottom: 3
  },
  labelStyle: {
    color: "#0F1A2A",
    fontFamily: "Roboto",
    fontSize: 18
  },
  labelContainer: {
    flexDirection: "column"
  }
});
