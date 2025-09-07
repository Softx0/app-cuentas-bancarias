/**
 * Componentes de botones de radio personalizados con soporte para opciones dobles y múltiples configuraciones
 */
import React, { useCallback, useMemo } from "react";

import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";

import CheckBoxReusable from "../CheckBoxReusable";

import CheckedSVG from "../../assets/icons/radiobutton-checked-icon.svg";
import CheckboxSVG from "../../assets/icons/radiobutton-unchecked-icon.svg";
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Componente original RadioButton (mantener para retrocompatibilidad)
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {any} props.value - Valor asociado al botón de radio
 * @param {boolean} props.checked - Estado de selección del botón
 * @param {Function} props.onPress - Función a ejecutar cuando se presiona el botón
 * @param {string} props.title - Texto que se muestra junto al botón
 * @param {Object} props.textStyle - Estilos adicionales para el texto
 * @param {Object} props.containerStyle - Estilos adicionales para el contenedor
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.position - Posición del ícono ('left' o 'right')
 * @returns {React.Element} Componente RadioButtonDouble
 */
const RadioButtonDouble = ({ value, checked, onPress, title, textStyle, containerStyle, disabled, position }) => {
  // Memoizar los componentes de íconos para evitar recrearlos en cada renderizado
  const CheckedIconComponent = useMemo(() => <CheckedSVG width={20} height={20} />, []);
  const UncheckedIconComponent = useMemo(() => <CheckboxSVG width={20} height={20} opacity={0.5} />, []);

  // Usar useCallback para el manejador de eventos
  const handlePress = useCallback(() => {
    if (typeof onPress === "function") {
      onPress(value);
    }
  }, [onPress, value]);

  return (
    <CheckBoxReusable
      title={title}
      checkedIcon={CheckedIconComponent}
      uncheckedIcon={UncheckedIconComponent}
      checked={checked}
      onPress={handlePress}
      disabled={disabled}
      textStyle={[styles.labelStyle, textStyle]}
      containerStyle={[styles.container, containerStyle]}
      iconRight={position === "right"}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={`${title}, ${checked ? "seleccionado" : "no seleccionado"}`}
    />
  );
};

/**
 * Componente de radio buttons doble con opciones configurables para cada botón
 * @component
 * @param {Object} props - Propiedades del componente
 *
 * @param {string} props.titleRadios - Título para el grupo de radio buttons
 * @param {boolean} props.showTitle - Controla si se muestra el título
 * @param {Object} props.titleStyle - Estilos adicionales para el título
 * @param {boolean} props.required - Indica si el campo es obligatorio
 * @param {boolean} props.showRequired - Controla si se muestra el indicador de obligatorio
 * @param {string} props.errorMessage - Mensaje de error a mostrar
 * @param {boolean} props.showError - Controla si se muestra el mensaje de error
 * @param {Object} props.errorStyle - Estilos adicionales para el mensaje de error
 * @param {string} props.orientation - Orientación de los botones ('horizontal' o 'vertical')
 *
 * @param {boolean} props.showLeft - Controla si se muestra el botón izquierdo
 * @param {string} props.labelLeft - Etiqueta para el botón izquierdo
 * @param {any} props.valueLeft - Valor asociado al botón izquierdo
 * @param {boolean} props.checkedLeft - Estado de selección del botón izquierdo
 * @param {Function} props.onPressLeft - Función a ejecutar cuando se presiona el botón izquierdo
 * @param {string} props.checkedColorLeft - Color para el estado seleccionado del botón izquierdo
 * @param {string} props.uncheckedColorLeft - Color para el estado no seleccionado del botón izquierdo
 * @param {Object} props.containerStyleLeft - Estilos adicionales para el contenedor del botón izquierdo
 * @param {Object} props.labelStyleLeft - Estilos adicionales para la etiqueta del botón izquierdo
 *
 * @param {boolean} props.showRight - Controla si se muestra el botón derecho
 * @param {string} props.labelRight - Etiqueta para el botón derecho
 * @param {any} props.valueRight - Valor asociado al botón derecho
 * @param {boolean} props.checkedRight - Estado de selección del botón derecho
 * @param {Function} props.onPressRight - Función a ejecutar cuando se presiona el botón derecho
 * @param {string} props.checkedColorRight - Color para el estado seleccionado del botón derecho
 * @param {string} props.uncheckedColorRight - Color para el estado no seleccionado del botón derecho
 * @param {Object} props.containerStyleRight - Estilos adicionales para el contenedor del botón derecho
 * @param {Object} props.labelStyleRight - Estilos adicionales para la etiqueta del botón derecho
 *
 * @param {boolean} props.disabled - Si ambos botones están deshabilitados
 * @param {Object} props.containerStyle - Estilos adicionales para el contenedor principal
 * @param {Object} props.iconSize - Tamaño de los íconos de los radio buttons
 * @returns {React.Element} Componente RadioButtonDoubleReusable
 */
const RadioButtonDoubleReusable = ({
  // Propiedades principales
  titleRadios,
  showTitle,
  titleStyle,
  required,
  showRequired,
  errorMessage,
  showError,
  errorStyle,
  orientation,

  // Propiedades específicas para el botón izquierdo
  showLeft,
  labelLeft,
  valueLeft,
  checkedLeft,
  onPressLeft,
  checkedColorLeft,
  uncheckedColorLeft,
  containerStyleLeft,
  labelStyleLeft,

  // Propiedades específicas para el botón derecho
  showRight,
  labelRight,
  valueRight,
  checkedRight,
  onPressRight,
  checkedColorRight,
  uncheckedColorRight,
  containerStyleRight,
  labelStyleRight,

  // Propiedades comunes
  disabled,
  containerStyle,
  iconSize = { width: 20, height: 20 }
}) => {
  // Crear íconos SVG personalizados para cada botón (memorizados)
  const getCheckedIcon = useCallback((color) => <CheckedSVG width={iconSize.width} height={iconSize.height} />, [iconSize]);

  const getUncheckedIcon = useCallback((color) => <CheckboxSVG width={iconSize.width} height={iconSize.height} opacity={0.5} />, [iconSize]);

  // Manejadores de eventos optimizados
  const handlePressLeft = useCallback(
    (value) => {
      if (typeof onPressLeft === "function") {
        onPressLeft(value);
      }
    },
    [onPressLeft]
  );

  const handlePressRight = useCallback(
    (value) => {
      if (typeof onPressRight === "function") {
        onPressRight(value);
      }
    },
    [onPressRight]
  );

  // Calcular estilos una sola vez (memorizados)
  const radioButtonsContainerStyle = useMemo(
    () => (orientation === "vertical" ? styles.radioButtonsContainerVertical : styles.radioButtonsContainerHorizontal),
    [orientation]
  );

  const buttonLeftStyle = useMemo(() => (orientation === "vertical" ? styles.radioButtonVertical : styles.radioButtonLeft), [orientation]);

  const buttonRightStyle = useMemo(() => (orientation === "vertical" ? styles.radioButtonVertical : styles.radioButtonRight), [orientation]);

  const titleTextStyle = useMemo(
    () => (showError ? [styles.titleText, styles.titleTextError, titleStyle] : [styles.titleText, titleStyle]),
    [showError, titleStyle]
  );


  return (
    <View
      style={[styles.mainContainer, containerStyle]}
      accessible={true}
      accessibilityRole="radiogroup"
      accessibilityLabel={titleRadios}
      accessibilityHint={required ? "Campo requerido" : ""}>
      {/* Título y requerido - Solo se muestra si showTitle es true */}
      {showTitle && (
        <View style={styles.titleContainer}>
          <Text style={titleTextStyle} accessibilityRole="text">
            {titleRadios}
          </Text>
          {showRequired && required && (
            <Text style={styles.requiredMark} accessibilityLabel="campo requerido">
              *
            </Text>
          )}
        </View>
      )}

      {/* Contenedor de los dos RadioButtons */}
      <View style={radioButtonsContainerStyle}>
        {/* RadioButton Izquierdo */}
        {showLeft && (
          <View style={buttonLeftStyle}>
            <CheckBoxReusable
              title={labelLeft}
              checkedIcon={getCheckedIcon(checkedColorLeft)}
              uncheckedIcon={getUncheckedIcon(uncheckedColorLeft)}
              checked={checkedLeft}
              onPress={() => handlePressLeft(valueLeft)}
              disabled={disabled}
              textStyle={[styles.labelStyle, labelStyleLeft]}
              containerStyle={[styles.container, containerStyleLeft]}
              iconRight={false}
              accessible={true}
              accessibilityRole="radio"
              accessibilityState={{
                checked: checkedLeft,
                disabled
              }}
              accessibilityLabel={`${labelLeft}, ${checkedLeft ? "seleccionado" : "no seleccionado"}`}
            />
          </View>
        )}

        {/* RadioButton Derecho */}
        {showRight && (
          <View style={buttonRightStyle}>
            <CheckBoxReusable
              title={labelRight}
              checkedIcon={getCheckedIcon(checkedColorRight)}
              uncheckedIcon={getUncheckedIcon(uncheckedColorRight)}
              checked={checkedRight}
              onPress={() => handlePressRight(valueRight)}
              disabled={disabled}
              textStyle={[styles.labelStyle, labelStyleRight]}
              containerStyle={[styles.container, containerStyleRight]}
              iconRight={false}
              accessible={true}
              accessibilityRole="radio"
              accessibilityState={{
                checked: checkedRight,
                disabled
              }}
              accessibilityLabel={`${labelRight}, ${checkedRight ? "seleccionado" : "no seleccionado"}`}
            />
          </View>
        )}
      </View>

      {/* Mensaje de error */}
      {showError && errorMessage && (
        <Text style={[styles.errorText, errorStyle]} accessible={true} accessibilityRole="text" accessibilityLabel={`Error: ${errorMessage}`}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

// PropTypes
RadioButtonDouble.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.string,
  labelStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  position: PropTypes.oneOf(["left", "right"])
};

RadioButtonDoubleReusable.propTypes = {
  // Propiedades principales
  titleRadios: PropTypes.string,
  showTitle: PropTypes.bool,
  titleStyle: PropTypes.object,
  required: PropTypes.bool,
  showRequired: PropTypes.bool,
  errorMessage: PropTypes.string,
  showError: PropTypes.bool,
  errorStyle: PropTypes.object,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),

  // Propiedades específicas para el botón izquierdo
  showLeft: PropTypes.bool,
  labelLeft: PropTypes.string,
  valueLeft: PropTypes.any,
  checkedLeft: PropTypes.bool,
  onPressLeft: PropTypes.func,
  checkedColorLeft: PropTypes.string,
  uncheckedColorLeft: PropTypes.string,
  containerStyleLeft: PropTypes.object,
  labelStyleLeft: PropTypes.object,

  // Propiedades específicas para el botón derecho
  showRight: PropTypes.bool,
  labelRight: PropTypes.string,
  valueRight: PropTypes.any,
  checkedRight: PropTypes.bool,
  onPressRight: PropTypes.func,
  checkedColorRight: PropTypes.string,
  uncheckedColorRight: PropTypes.string,
  containerStyleRight: PropTypes.object,
  labelStyleRight: PropTypes.object,

  // Propiedades comunes
  disabled: PropTypes.bool,
  containerStyle: PropTypes.object,
  iconSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
};

// Estilos
const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    flexDirection: "column",
    marginVertical: 5
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    fontFamily: "SF Pro",
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary
  },
  titleText: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 16.5 : 16.5,
    fontWeight: IS_IOS ? "500" : "600",
    color: Colors.textPrimary
  },
  titleTextError: {
    color: "#F04438"
  },
  requiredMark: {
    color: "red",
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "500"
  },
  radioButtonsContainerHorizontal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: -10
  },
  radioButtonsContainerVertical: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: -10
  },
  radioButtonLeft: {
    marginRight: 10
  },
  radioButtonRight: {
    flex: 1
  },
  radioButtonVertical: {
    width: "100%",
    marginBottom: 5
  },
  container: {
    borderWidth: 0,
    backgroundColor: "transparent",
    margin: 0,
    padding: 0
  },
  labelStyle: {
    fontFamily: "SF Pro",
    fontSize: IS_IOS ? 15 : 15,
    fontWeight: "500",
    color: Colors.textPrimary
  },
  errorText: {
    color: "#F04438",
    fontSize: IS_IOS ? 14.5 : 14,
    marginTop: 4,
    fontFamily: "SF Pro",
    fontWeight: "500"
  }
});

// Exportamos ambos componentes
export { RadioButtonDouble, RadioButtonDoubleReusable };
export default RadioButtonDoubleReusable;
