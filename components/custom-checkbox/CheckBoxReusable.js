/**
 * Componente personalizado de checkbox con iconos SVG
 */
import React from "react";

import { StyleSheet } from "react-native";

import IconCheckboxBlueLlenoSVG from "../../assets/icons/checbox-blue-lleno.svg";
import IconCheckboxVacioSVG from "../../assets/icons/checkbox-vacio.svg";
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";
import CheckBoxReusable from "../CheckBoxReusable";

/**
 * Componente reutilizable de checkbox con iconos SVG personalizados
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {any} props.value - Valor asociado al checkbox
 * @param {boolean} props.checked - Estado de selección del checkbox
 * @param {Function} props.onPress - Función a ejecutar cuando se presiona el checkbox
 * @param {string} props.title - Texto que se muestra junto al checkbox
 * @param {Object} props.textStyle - Estilos adicionales para el texto
 * @param {Object} props.containerStyle - Estilos adicionales para el contenedor
 * @param {boolean} props.disabled - Si el checkbox está deshabilitado
 * @param {string} props.position - Posición del ícono ('left' o 'right')
 * @returns {React.Element} Componente CheckBoxReusable
 */
const CheckBoxReusableWrapper = ({ value, checked, onPress, title, textStyle, containerStyle, disabled, position }) => {
  const CheckedIconComponent = <IconCheckboxBlueLlenoSVG width={22} height={22} />;
  const UncheckedIconComponent = <IconCheckboxVacioSVG width={22} height={22} opacity={0.5} />;

  return (
    <CheckBoxReusable
      title={title}
      checkedIcon={CheckedIconComponent}
      uncheckedIcon={UncheckedIconComponent}
      checked={checked}
      onPress={() => onPress(value)}
      disabled={disabled}
      textStyle={[styles.textStyle, textStyle]}
      containerStyle={[styles.container, containerStyle]}
      iconRight={position === "right"}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: "transparent",
    margin: 0,
    padding: 0
  },
  textStyle: {
    fontFamily: "SF Pro",
    fontSize: IS_IOS ? 14 : 14,
    fontWeight: "500",
    color: Colors.textPrimary
  }
});

CheckBoxReusableWrapper.defaultProps = {
  value: "checkbox",
  checked: false,
  onPress: () => {
    console.log("checkbox pressed");
  },
  title: "",
  textStyle: {},
  containerStyle: {},
  disabled: false,
  position: "left"
};

export default CheckBoxReusableWrapper;
