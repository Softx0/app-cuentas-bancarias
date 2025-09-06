import React from "react";

import CustomPickerModal from "../../components/custom-picker-modal/CustomPickerModal";

/**
 * @typedef {Object} CustomDropdownProps
 * @property {Object} [value={}] - Valor seleccionado para el dropdown.
 * @property {Array} [data=[]] - Conjunto de datos a mostrar en el dropdown.
 * @property {Function} [onValueChange=() => {}] - Función llamada al cambiar el valor seleccionado.
 * @property {string} [title=""] - Título del dropdown que se muestra en la cabecera.
 * @property {string} [placeholder=""] - Texto de marcador de posición a mostrar en el dropdown.
 * @property {Object} [containerDropDownStyle={}] - Estilos personalizados para el contenedor del dropdown.
 * @property {Object} [containerHeaderStyle={}] - Estilos personalizados para el contenedor de la cabecera del dropdown.
 * @property {Object} [placeholderStyles={}] - Estilos para el placeholder.
 * @property {Object} [optionStyles={}] - Estilos para las opciones disponibles.
 * @property {number} [fontSizePlaceholder=16] - Tamaño de fuente para el placeholder.
 * @property {string} [optionColor=""] - Color de las opciones.
 * @property {string} [activeColor=""] - Color activo para la opción seleccionada.
 * @property {string} [inactiveColor=""] - Color inactivo para las opciones no seleccionadas.
 * @property {Object} [containerValueDropDownStyle={}] - Estilos personalizados para el contenedor del valor del dropdown.
 * @property {number} [marginLeft=0] - Margen izquierdo del dropdown.
 * @property {number} [marginTop=0] - Margen superior del dropdown.
 * @property {boolean} [isLoading=false] - Indica si se muestra un indicador de carga.
 * @property {boolean} [isDisabled=false] - Indica si el dropdown está deshabilitado.
 * @property {Function} [onClosed] - Función llamada cuando se cierra el dropdown.
 */

/**
 * Componente CustomDropdown que renderiza un dropdown personalizado mediante CustomPickerModal.
 *
 * @param {CustomDropdownProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente CustomDropdown.
 */
const CustomDropdown = ({
  value,
  data,
  onValueChange,
  title,
  placeholder,
  containerDropDownStyle,
  containerHeaderStyle,
  placeholderStyles,
  optionStyles,
  fontSizePlaceholder,
  optionColor,
  activeColor,
  inactiveColor,
  containerValueDropDownStyle,
  marginLeft,
  marginTop,
  isLoading,
  isDisabled,
  onClosed
}) => (
  <>
    <CustomPickerModal
      value={value}
      data={data}
      onValueChange={onValueChange}
      placeholder={title}
      realNamePlaceholder={placeholder}
      otherContainerStyles={containerDropDownStyle}
      headerContainerStyle={containerHeaderStyle}
      titleStyles={placeholderStyles}
      optionStyles={optionStyles}
      optionColor={optionColor}
      fontSizePlaceholder={fontSizePlaceholder}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      containerStyle={containerValueDropDownStyle}
      marginLeft={marginLeft}
      marginTop={marginTop}
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClosed={onClosed}
    />
  </>
);

CustomDropdown.defaultProps = {
  value: {},
  data: [],
  onValueChange: () => {},
  title: "",
  placeholder: "",
  containerDropDownStyle: {},
  containerHeaderStyle: {},
  placeholderStyles: {},
  optionStyles: {},
  fontSizePlaceholder: 16,
  optionColor: "",
  activeColor: "",
  inactiveColor: "",
  containerValueDropDownStyle: {},
  marginTop: 0,
  marginLeft: 0,
  isLoading: false,
  isDisabled: false
};

export default CustomDropdown;
