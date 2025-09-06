import React, { useCallback, useMemo } from "react";

import PropTypes from "prop-types";
import { StyleSheet, Text, TextInput, View } from "react-native";

import AlertRedSVG from "../../assets/icons/alert-circle-red.svg";
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Componente reutilizable de entrada de texto.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.autoCapitalize="none"] - Controla la capitalización automática del texto.
 * @param {boolean} [props.autoCorrect=true] - Habilita o deshabilita la corrección automática.
 * @param {boolean} [props.autoFocus=false] - Enfoca automáticamente la entrada de texto al montarse.
 * @param {boolean} [props.blurOnSubmit=false] - Desenfoca la entrada de texto al enviarla.
 * @param {boolean} [props.editable=true] - Define si la entrada de texto es editable.
 * @param {string} [props.keyboardType="default"] - Especifica el tipo de teclado a mostrar.
 * @param {number} [props.maxLength] - Número máximo de caracteres permitidos.
 * @param {boolean} [props.multiline=false] - Permite varias líneas de texto.
 * @param {number} [props.numberOfLines] - Número de líneas que debe mostrar la entrada de texto.
 * @param {string} [props.placeholder=""] - Texto mostrado cuando la entrada está vacía.
 * @param {string} [props.placeholderTextColor="#94A3B8"] - Color del texto del marcador de posición.
 * @param {number} [props.placeholderFontSize=14] - Tamaño de fuente del placeholder.
 * @param {boolean} [props.secureTextEntry=false] - Oculta el texto ingresado (útil para contraseñas).
 * @param {string} [props.selectionColor="#007AFF"] - Color del cursor y del texto seleccionado.
 * @param {Object} [props.style={}] - Estilo de la entrada de texto.
 * @param {string} [props.value=""] - Valor de la entrada de texto.
 * @param {string} [props.defaultValue=""] - Valor inicial de la entrada de texto.
 * @param {Function} [props.onChangeText] - Se llama cuando el texto cambia.
 * @param {Function} [props.onEndEditing] - Se llama cuando el usuario termina de editar.
 * @param {Function} [props.onSubmitEditing] - Se llama cuando el usuario presiona Enter.
 * @param {Function} [props.onFocus] - Se llama cuando la entrada de texto obtiene el foco.
 * @param {Function} [props.onBlur] - Se llama cuando la entrada de texto pierde el foco.
 * @param {boolean} [props.accessible=true] - Define si la entrada de texto es accesible.
 * @param {string} [props.accessibilityLabel=""] - Etiqueta accesible para tecnologías de asistencia.
 * @param {string} [props.textAlign="left"] - Alineación del texto (izquierda, centro, derecha).
 * @param {string} [props.textAlignVertical="auto"] - Alineación vertical del texto.
 * @param {string} [props.underlineColorAndroid="transparent"] - Color de la línea subrayada (solo Android).
 * @param {string} [props.textContentType="none"] - Tipo de contenido de texto para la predicción.
 * @param {string} [props.returnKeyType="default"] - Texto del botón de retorno del teclado.
 * @param {string} [props.autoComplete="off"] - Tipo de autocompletado para teclados web.
 * @param {string} [props.label=""] - Etiqueta que se muestra sobre el campo.
 * @param {boolean} [props.required=false] - Indica si el campo es requerido.
 * @param {boolean} [props.showRequired=true] - Controla la visibilidad del indicador de campo requerido.
 * @param {string} [props.errorMessage] - Mensaje de error a mostrar.
 * @param {Object} [props.errorInput={}] - Estilos para el input en estado de error.
 * @param {Object} [props.errorLabel={}] - Estilos para la etiqueta en estado de error.
 * @param {Object} [props.errorText={}] - Estilos para el texto en estado de error.
 * @param {Object} [props.errorMessageStyle={}] - Estilos para el mensaje de error.
 * @param {Object} [props.containerStyle={}] - Estilos para el contenedor principal.
 * @param {Object} [props.labelContainerStyle={}] - Estilos para el contenedor de la etiqueta.
 * @param {Object} [props.labelStyle={}] - Estilos para la etiqueta.
 * @param {Object} [props.errorIconSize={ width: 20, height: 20 }] - Tamaño del icono de error.
 * @returns {JSX.Element} Componente `InputTextReusable`.
 */
const InputTextReusable = ({
  // Propiedades del TextInput nativo
  autoCapitalize = "none",
  autoCorrect = true,
  autoFocus = false,
  blurOnSubmit = false,
  editable = true,
  keyboardType = "default",
  maxLength,
  multiline = false,
  numberOfLines,
  placeholder = "",
  placeholderTextColor = Colors.textSecondary || "#94A3B8",
  placeholderFontSize = 14,
  secureTextEntry = false,
  selectionColor = "#B3B9C6",
  style = {},
  value = "",
  defaultValue = "",
  onChangeText = () => {},
  onEndEditing = () => {},
  onSubmitEditing = () => {},
  onFocus = () => {},
  onBlur = () => {},
  accessible = true,
  accessibilityLabel = "",
  textAlign = "left",
  textAlignVertical = "auto",
  underlineColorAndroid = "transparent",
  textContentType = "none",
  returnKeyType = "default",
  autoComplete = "off",

  // Propiedades personalizadas
  label = "",
  required = false,
  showRequired = true,
  errorMessage,
  errorInput = {},
  errorLabel = {},
  errorText = {},
  errorMessageStyle = {},
  containerStyle = {},
  labelContainerStyle = {},
  labelStyle = {},
  errorIconSize = { width: 20, height: 20 }
}) => {
  // Cálculo de estilos memorizados para optimizar rendimiento
  const containerStyles = useMemo(() => [styles.container, containerStyle], [containerStyle]);

  const labelContainerStyles = useMemo(() => [styles.labelContainer, labelContainerStyle], [labelContainerStyle]);

  const labelStyles = useMemo(() => [styles.labelStyle, labelStyle, errorMessage && [styles.errorLabel, errorLabel]], [labelStyle, errorMessage, errorLabel]);

  const inputContainerStyles = useMemo(
    () => [styles.inputContainer, errorMessage && [styles.errorInput, errorInput], !editable && styles.disabledInput],
    [errorMessage, errorInput, editable]
  );

  const inputStyles = useMemo(
    () => [styles.inputStyle, style, { fontSize: placeholderFontSize }, errorMessage && [styles.errorText, errorText], !editable && styles.disabledText],
    [style, placeholderFontSize, errorMessage, errorText, editable]
  );

  const errorMessageStyles = useMemo(() => [styles.errorMessageStyle, errorMessageStyle], [errorMessageStyle]);

  // Determinar si mostrar el asterisco según showRequired y si el campo tiene valor
  const shouldShowAsterisk = useMemo(() => required && showRequired && (!value || value.trim() === ""), [required, showRequired, value]);

  // Handlers optimizados con useCallback
  const handleChangeText = useCallback((text) => onChangeText(text), [onChangeText]);

  const handleEndEditing = useCallback((e) => onEndEditing(e), [onEndEditing]);

  const handleSubmitEditing = useCallback((e) => onSubmitEditing(e), [onSubmitEditing]);

  const handleFocus = useCallback((e) => onFocus(e), [onFocus]);

  const handleBlur = useCallback((e) => onBlur(e), [onBlur]);

  return (
    <View style={containerStyles}>
      {/* Label */}
      {label && (
        <View style={labelContainerStyles}>
          <Text style={labelStyles} accessible={accessible} accessibilityRole="text">
            {label}
            {shouldShowAsterisk && <Text style={styles.requiredAsterisk}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input container */}
      <View style={inputContainerStyles}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          blurOnSubmit={!blurOnSubmit}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          selectionColor={selectionColor}
          style={inputStyles}
          value={value}
          defaultValue={defaultValue}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          onSubmitEditing={handleSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={errorMessage || `Introducir ${label}`}
          accessibilityState={{
            disabled: !editable,
            invalid: Boolean(errorMessage)
          }}
          textAlign={textAlign}
          textAlignVertical={textAlignVertical}
          underlineColorAndroid={underlineColorAndroid}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          autoComplete={autoComplete}
        />

        {/* Error icon */}
        {errorMessage && (
          <AlertRedSVG
            width={errorIconSize.width}
            height={errorIconSize.height}
            style={styles.errorIcon}
            accessible={accessible}
            accessibilityRole="image"
            accessibilityLabel="Icono de error"
          />
        )}
      </View>

      {/* Error message */}
      {errorMessage && (
        <Text style={errorMessageStyles} accessible={accessible} accessibilityRole="text" accessibilityLabel={`Error: ${errorMessage}`}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  labelStyle: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 16.5 : 16.5,
    fontWeight: IS_IOS ? "500" : "600",
    color: Colors.textPrimary
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF"
  },
  inputStyle: {
    flex: 1,
    paddingTop: IS_IOS ? 13 : 10,
    paddingLeft: 16,
    paddingBottom: IS_IOS ? 13 : 8,
    paddingRight: 24,
    fontSize: 15,
    color: "#0F1929"
  },
  errorInput: {
    borderColor: "#FAAAA4",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorLabel: {
    color: "#F04438",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorText: {
    color: "#6B758C",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorMessageStyle: {
    color: "#F04438",
    fontSize: IS_IOS ? 14.5 : 14,
    marginTop: 4,
    textAlign: "left",
    paddingHorizontal: 6,
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  disabledInput: {
    backgroundColor: "#F5F6F8",
    borderColor: "#E1E4E8"
  },
  disabledText: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  requiredAsterisk: {
    color: "#FF4D4F"
  },
  errorIcon: {
    marginRight: 16
  }
});

// PropTypes
InputTextReusable.propTypes = {
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  autoCorrect: PropTypes.bool,
  autoFocus: PropTypes.bool,
  blurOnSubmit: PropTypes.bool,
  editable: PropTypes.bool,
  keyboardType: PropTypes.string,
  maxLength: PropTypes.number,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  placeholderFontSize: PropTypes.number,
  secureTextEntry: PropTypes.bool,
  selectionColor: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChangeText: PropTypes.func,
  onEndEditing: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  accessible: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  textAlign: PropTypes.string,
  textAlignVertical: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  textContentType: PropTypes.string,
  returnKeyType: PropTypes.string,
  autoComplete: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  showRequired: PropTypes.bool,
  errorMessage: PropTypes.string,
  errorInput: PropTypes.object,
  errorLabel: PropTypes.object,
  errorText: PropTypes.object,
  errorMessageStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  labelContainerStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  errorIconSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
};

export default InputTextReusable;
