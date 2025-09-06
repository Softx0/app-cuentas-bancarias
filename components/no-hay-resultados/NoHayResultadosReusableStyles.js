/**
 * @file NoHayResultadosReusableStyles.js
 * @description Estilos para el componente NoHayResultadosReusable
 * @module styles/NoHayResultadosReusableStyles
 */
import { StyleSheet } from "react-native";

import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Estilos del componente NoHayResultadosReusable
 */
export const styles = StyleSheet.create({
  /**
   * Estilo para el contenedor principal
   */
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  /**
   * Estilo para el contenedor del título
   */
  titleContainer: {
    marginTop: 20,
    marginBottom: 10
  },

  /**
   * Estilo para el texto del título
   */
  title: {
    lineHeight: 30,
    fontWeight: IS_IOS ? "510" : "bold",
    fontFamily: "SF Pro",
    fontSize: 22,
    color: "#464C5E",
    textAlign: "center"
  },

  /**
   * Estilo para el contenedor del subtítulo
   */
  subtitleContainer: {
    marginHorizontal: 20,
    marginBottom: 20
  },

  /**
   * Estilo para el texto del subtítulo
   */
  subtitle: {
    lineHeight: 24,
    fontWeight: "400",
    fontFamily: "SF Pro",
    fontSize: 18,
    color: "#64748B",
    textAlign: "center"
  },

  /**
   * Estilo para el contenedor del botón
   */
  buttonContainer: {},

  /**
   * Estilo personalizado para el contenedor del botón CustomButton
   */
  buttonCustomContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#D7DAE0"
  },

  /**
   * Estilo para el texto del botón
   */
  buttonTitleStyles: {
    lineHeight: 20,
    fontWeight: IS_IOS ? "600" : "bold",
    fontFamily: "SF Pro",
    color: "#6B758C",
    textAlign: "center",
    paddingHorizontal: 24,
    paddingVertical: 14
  }
});

export default styles;
