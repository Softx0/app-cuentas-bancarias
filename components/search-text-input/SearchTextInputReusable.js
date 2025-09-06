// ============= IMPORTACIONES =============
// Importaciones de React y React Native
import React from "react";

// Importaciones de iconos
import IconSearch from "../../assets/icons/feather-search-black.svg";
import IconXClose from "../../assets/icons/x-close.svg";
// Importaciones de componentes
import CustomSeparator from "../../components/custom-separator/CustomSeparator";
import CheckRender from "../../components/security/CheckRender";
// Importaciones de temas y estilos
import Metrics from "../../themes/Metrics";
// Importaciones de utilidades
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { localToString } from "../../utils/StringUtil";
import { IS_IOS } from "../../utils/StyleHelpers";


import Colors from "../../themes/Colors";

// ============= DOCUMENTACIÓN DE PROPIEDADES =============
/**
 * @typedef {Object} SearchTextInputProps
 * @property {string} [placeholder="Buscar"] - Texto de marcador de posición para el input.
 * @property {string} [placeholderTextColor=Colors.txtDetail] - Color del texto del placeholder.
 * @property {Object} [customPlaceholderStyle={}] - Estilos personalizados para el placeholder.
 * @property {*} [statusArray=[]] - Arreglo de estados (no se usa directamente en este componente).
 * @property {*} [value=""] - Valor actual del input.
 * @property {Function} [onValueChange=(val) => console.log(val)] - Función a llamar al cambiar el valor.
 * @property {string} [filterText="Filtro"] - Texto relacionado al filtro (no se usa directamente en este componente).
 * @property {Function} [statusPress=(val) => console.log(val)] - Función a llamar al presionar algún estado (no se usa directamente en este componente).
 * @property {*} [disabled=false] - Indica si el input se encuentra deshabilitado.
 * @property {*} [showFilter=true] - Indica si se mostrará la opción de filtro (no se usa directamente en este componente).
 * @property {Object} [containerStyle={}] - Estilos adicionales para el contenedor principal.
 * @property {Object} [inputStyles={}] - Estilos adicionales para el campo de texto.
 * @property {Function} [onBlur=(val) => console.log(val)] - Función a ejecutar al perder el foco.
 * @property {Function} [onFocus=(val) => console.log(val)] - Función a ejecutar al obtener el foco.
 * @property {boolean} [isFocusSearchBar=false] - Indica si la barra de búsqueda tiene foco.
 * @property {string} [keyboardType=""] - Tipo de teclado a mostrar.
 * @property {*} [textInputRef=null] - Referencia al TextInput.
 * @property {Object} [titleBuscarStyles] - Estilos personalizados para el texto del botón "Buscar".
 * @property {Function} [resetSearch] - Función para reiniciar la búsqueda.
 * @property {Function} [onClear] - Función a llamar al limpiar el contenido del input.
 * @property {Function} [searchBarInputValue] - Función a llamar para ejecutar la búsqueda.
 * @property {boolean} [isVisibleIconSearch=true] - Indica si se debe mostrar el ícono de búsqueda.
 */

// ============= DEFINICIÓN DEL COMPONENTE =============
/**
 * Componente que renderiza un campo de búsqueda con funcionalidades adicionales.
 * @param {SearchTextInputProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente SearchTextInputReusable.
 */
const SearchTextInputReusable = ({
  // Texto y apariencia
  placeholder = "Buscar",
  placeholderTextColor = "#6b758c",
  customPlaceholderStyle = {}, // Nueva prop para estilo del placeholder personalizado
  titleBuscarStyles = Styles.titleBuscarStyles,

  // Estado y valores
  value = "",
  statusArray = [],

  // Estilo y personalización
  containerStyle = {},
  inputStyles = {},
  isVisibleIconSearch = true,

  // Estado de la interfaz
  disabled = false,
  showFilter = true,
  isFocusSearchBar = false,

  // Configuraciones adicionales
  keyboardType = "",
  textInputRef = null,
  filterText = "Filtro",

  // Manejadores de eventos
  onValueChange = (val) => console.log(val),
  statusPress = (val) => console.log(val),
  onBlur = (val) => console.log(val),
  onFocus = (val) => console.log(val),
  resetSearch,
  onClear,
  searchBarInputValue
}) => {
  // ============= VARIABLES DE ESTADO Y CÁLCULOS =============
  const stringValue = localToString(value);
  const isEmpty = stringValue.length === 0;
  const hasFocusWithContent = isFocusSearchBar && !isEmpty;

  // ============= MANEJADORES DE EVENTOS =============
  const handleClear = () => {
    resetSearch && resetSearch();
    onClear && onClear();
  };

  // ============= COMPONENTES DE RENDERIZADO =============
  // Renderiza el icono de búsqueda
  const renderSearchIcon = () => (
    <CheckRender allowed={isVisibleIconSearch}>
      <IconSearch width={18} height={18} />
    </CheckRender>
  );

  // Renderiza el botón para limpiar el texto
  const renderClearButton = () => (
    <CheckRender allowed={!isEmpty}>
      <TouchableOpacity onPress={handleClear}>
        <IconXClose width={22} height={22} />
      </TouchableOpacity>
    </CheckRender>
  );

  // Renderiza el botón de búsqueda
  const renderSearchButton = () => (
    <CheckRender allowed={isFocusSearchBar}>
      <TouchableOpacity onPress={searchBarInputValue} disabled={isEmpty}>
        <View
          style={{
            // marginLeft: 10,
            backgroundColor: isEmpty ? Colors.neutral[400] : "#3983D8",
            borderRadius: 100,
            paddingVertical: 12,
            paddingHorizontal: 18,
            marginRight: 12
          }}>
          <Text style={titleBuscarStyles}>Buscar</Text>
        </View>
      </TouchableOpacity>
    </CheckRender>
  );

  // ============= RENDERIZADO PRINCIPAL DEL COMPONENTE =============
  return (
    // Contenedor principal que organiza la barra de búsqueda y el botón
    <View style={Styles.mainContainer}>
      {/* Contenedor de la barra de búsqueda */}
      <View
        style={[
          Styles.container,
          containerStyle,
          // Aplica borde azul cuando hay contenido y está enfocado
          hasFocusWithContent && { borderColor: Colors.primary[300] }
        ]}>
        {/* Icono de búsqueda (condicional) */}
        {renderSearchIcon()}

        {/* Contenedor para posicionar el TextInput y el placeholder personalizado */}
        <View style={{ flex: 1, position: "relative" }}>
          {/* Placeholder personalizado - solo visible cuando está vacío */}
          {isEmpty && !isFocusSearchBar && (
            <Text
              style={[Styles.customPlaceholder, customPlaceholderStyle, { color: placeholderTextColor }]}
              pointerEvents="none" // Permite que los toques pasen al TextInput debajo
            >
              {placeholder}
            </Text>
          )}

          {/* Campo de texto para búsqueda */}
          <TextInput
            ref={textInputRef}
            style={[Styles.input, inputStyles]}
            placeholder="" // Placeholder vacío ya que usamos uno personalizado
            underlineColorAndroid="transparent"
            onChangeText={onValueChange}
            value={value}
            editable={!disabled}
            hitSlop={{ top: 15, right: 0, bottom: 15, left: 30 }}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType={keyboardType}
          />
        </View>

        {/* Separador entre el input y el botón de limpiar */}
        <CustomSeparator width={10} />

        {/* Botón para limpiar el texto (condicional) */}
        {renderClearButton()}
      </View>
      {/* Botón de búsqueda (condicional) */}
      {renderSearchButton()}
    </View>
  );
};

// ============= ESTILOS DEL COMPONENTE =============
const Styles = StyleSheet.create({
  // Estilo del contenedor principal que alberga la barra y el botón
  mainContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },

  // Estilo del contenedor de la barra de búsqueda
  container: {
    flex: 1,
    paddingHorizontal: Metrics.mXl,
    paddingLeft: IS_IOS ? null : 30,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginHorizontal: 16,
    marginVertical: 16
  },

  // Estilo del campo de texto
  input: {
    flex: 1,
    fontFamily: "SF Pro",
    paddingLeft: 0,
    marginLeft: 8,
    fontSize: 16
  },

  // Estilo para el placeholder personalizado
  customPlaceholder: {
    position: "absolute",
    left: 8,
    top: 0,
    fontSize: 16,
    fontFamily: "SF Pro",
    paddingTop: 17.5 // Centra verticalmente (height 55 / 2 - fontSize / 2)
    // zIndex: 1
  },

  // Estilo del texto de filtro
  filterText: {
    textAlign: "center",
    paddingTop: 10,
    color: "#b3b6"
  },

  // Estilos de los iconos
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

  // Estilo del texto del botón "Buscar"
  titleBuscarStyles: {
    fontFamily: "SF Pro",
    color: Colors.neutral[600],
    fontSize: 14
  }
});

// ============= EXPORTACIÓN DEL COMPONENTE =============
export default SearchTextInputReusable;
