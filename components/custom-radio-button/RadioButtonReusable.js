/**
 * Componente personalizado de botón de radio con iconos SVG y funcionalidades avanzadas
 */
import React, { useCallback, useMemo } from "react";

import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";

import CheckedSVG from "../../assets/icons/icon-checked.svg";
import CheckboxSVG from "../../assets/icons/icon-unchecked.svg";
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Componente reutilizable de botón de radio con iconos SVG personalizados y funcionalidades avanzadas
 * @component
 * @param {Object} props - Propiedades del componente
 *
 * @param {string} props.title - Título para el grupo de radio buttons
 * @param {boolean} props.showTitle - Controla si se muestra el título
 * @param {Object} props.titleStyle - Estilos adicionales para el título
 * @param {boolean} props.required - Indica si el campo es obligatorio
 * @param {boolean} props.showRequired - Controla si se muestra el indicador de obligatorio
 * @param {string} props.errorMessage - Mensaje de error a mostrar
 * @param {boolean} props.showError - Controla si se muestra el mensaje de error
 * @param {Object} props.errorStyle - Estilos adicionales para el mensaje de error
 *
 * @param {string} props.label - Etiqueta para el botón de radio
 * @param {any} props.value - Valor asociado al botón de radio
 * @param {boolean} props.checked - Estado de selección del botón
 * @param {Function} props.onPress - Función a ejecutar cuando se presiona el botón
 * @param {string} props.checkedColor - Color para el estado seleccionado del botón
 * @param {string} props.uncheckedColor - Color para el estado no seleccionado del botón
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {Object} props.labelStyle - Estilos adicionales para la etiqueta del botón
 * @param {Object} props.buttonContainerStyle - Estilos adicionales para el contenedor del botón
 * @param {string} props.position - Posición del ícono ('left' o 'right')
 *
 * @param {Object} props.containerStyle - Estilos adicionales para el contenedor principal
 * @param {Object} props.iconSize - Tamaño personalizado para los íconos
 * @returns {React.Element} Componente RadioButtonReusable
 */
const RadioButtonReusable = ({
  // Propiedades principales
  title,
  showTitle = true,
  titleStyle,
  required = false,
  showRequired = true,
  errorMessage,
  showError = false,
  errorStyle,

  // Propiedades específicas para el botón
  label,
  value,
  checked,
  onPress,
  checkedColor,
  uncheckedColor,
  disabled = false,
  labelStyle,
  buttonContainerStyle,
  position = "left",

  // Propiedades comunes
  containerStyle,
  iconSize = { width: 20, height: 20 }
}) => {
  // Crear íconos SVG personalizados (memorizados)
  const CheckedIconComponent = useMemo(() => <CheckedSVG width={iconSize.width} height={iconSize.height} />, [iconSize.width, iconSize.height]);

  const UncheckedIconComponent = useMemo(
    () => <CheckboxSVG width={iconSize.width} height={iconSize.height} opacity={0.5} />,
    [iconSize.width, iconSize.height]
  );

  // Manejador de eventos optimizado
  const handlePress = useCallback(() => {
    if (typeof onPress === "function") {
      onPress(value);
    }
  }, [onPress, value]);

  // Calcular estilos una sola vez (memorizados)
  const titleTextStyle = useMemo(
    () => (showError ? [styles.titleText, styles.titleTextError, titleStyle] : [styles.titleText, titleStyle]),
    [showError, titleStyle]
  );

  // Generación de ID único para el botón (para accesibilidad)
  const radioId = useMemo(() => `radio-${label?.replace(/\s+/g, "-")?.toLowerCase() || ""}`, [label]);

  return (
    <View
      style={[styles.mainContainer, containerStyle]}
      accessible={true}
      accessibilityRole="radiogroup"
      accessibilityLabel={title}
      accessibilityHint={required ? "Campo requerido" : ""}>
      {/* Título y requerido - Solo se muestra si showTitle es true */}
      {showTitle && title && (
        <View style={styles.titleContainer}>
          <Text style={titleTextStyle} accessibilityRole="text">
            {title}
          </Text>
          {showRequired && required && (
            <Text style={styles.requiredMark} accessibilityLabel="campo requerido">
              *
            </Text>
          )}
        </View>
      )}

      {/* Contenedor del RadioButton */}
      <View style={styles.radioButtonContainer}>
        <CheckBox
          title={label}
          checkedIcon={CheckedIconComponent}
          uncheckedIcon={UncheckedIconComponent}
          checked={checked}
          onPress={handlePress}
          disabled={disabled}
          textStyle={[styles.labelStyle, labelStyle, disabled && styles.disabledText]}
          containerStyle={[styles.container, buttonContainerStyle, disabled && styles.disabledContainer]}
          iconRight={position === "right"}
          accessible={true}
          accessibilityRole="radio"
          accessibilityState={{
            checked,
            disabled
          }}
          accessibilityLabel={`${label}, ${checked ? "seleccionado" : "no seleccionado"}`}
          accessibilityHint="Presiona para cambiar la selección"
        />
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
    marginBottom: 8
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
  radioButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: -10
  },
  container: {
    borderWidth: 0,
    backgroundColor: "transparent",
    margin: 0,
    padding: 0
  },
  labelStyle: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 15 : 15,
    fontWeight: "500",
    color: Colors.textPrimary
  },
  disabledText: {
    color: "#94A3B8"
  },
  disabledContainer: {
    opacity: 0.7
  },
  errorText: {
    color: "#F04438",
    fontSize: IS_IOS ? 14.5 : 14,
    marginTop: 4,
    fontFamily: "SF Pro",
    fontWeight: "500"
  }
});

// PropTypes para validación de tipos
RadioButtonReusable.propTypes = {
  // Propiedades principales
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  titleStyle: PropTypes.object,
  required: PropTypes.bool,
  showRequired: PropTypes.bool,
  errorMessage: PropTypes.string,
  showError: PropTypes.bool,
  errorStyle: PropTypes.object,

  // Propiedades específicas para el botón
  label: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string,
  disabled: PropTypes.bool,
  labelStyle: PropTypes.object,
  buttonContainerStyle: PropTypes.object,
  position: PropTypes.oneOf(["left", "right"]),

  // Propiedades comunes
  containerStyle: PropTypes.object,
  iconSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
};

export default RadioButtonReusable;
