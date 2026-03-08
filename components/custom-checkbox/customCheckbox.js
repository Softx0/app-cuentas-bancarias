
import { Text, TouchableOpacity, View } from "react-native";

import IconCheckSVG from "../../assets/icons/check_small.svg";
import CheckRender from "../security/CheckRender";
import Styles from "./style/CustomCheckboxStyle";

/**
 * Componente CustomCheckbox.
 *
 * Renderiza un checkbox personalizado con etiqueta. El componente muestra un ícono
 * cuando está seleccionado y ejecuta la función onSelect al presionarlo.
 *
 * @component
 * @example
 * return (
 *   <CustomCheckbox
 *     label="Aceptar términos y condiciones"
 *     isSelected={true}
 *     onSelect={() => console.log("Checkbox presionado")}
 *   />
 * );
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.label - Texto a mostrar al lado del checkbox.
 * @param {boolean} props.isSelected - Bandera que indica si el checkbox está seleccionado.
 * @param {function} props.onSelect - Función que se invoca al presionar el checkbox.
 * @param {boolean} [props.disabled=false] - Indica si el checkbox está deshabilitado.
 * @param {Object} [props.containerCheck=Styles.containerCheck] - Estilos para el contenedor principal.
 * @param {Object} [props.checkboxContainer=Styles.checkboxContainer] - Estilos para el contenedor del checkbox.
 * @param {Object} [props.labelContainer=Styles.labelContainer] - Estilos para el contenedor de la etiqueta.
 * @param {Object} [props.labelStyle=Styles.labelStyle] - Estilos para el texto de la etiqueta.
 * @param {Object} [props.iconContainer=Styles.iconContainer] - Estilos para el contenedor del ícono.
 * @param {Object} [props.checkbox=Styles.checkbox] - Estilos para el checkbox por defecto.
 * @param {Object} [props.checkboxSelected=Styles.checkboxSelected] - Estilos para el checkbox cuando está seleccionado.
 */
const CustomCheckbox = ({
  label = "",
  isSelected = false,
  onSelect = () => {},
  disabled = false,
  containerCheck = Styles.containerCheck,
  checkboxContainer = Styles.checkboxContainer,
  labelContainer = Styles.labelContainer,
  labelStyle = Styles.labelStyle,
  iconContainer = Styles.iconContainer,
  checkbox = Styles.checkbox,
  checkboxSelected = Styles.checkboxSelected
}) => (
  <View style={[containerCheck]}>
    <TouchableOpacity onPress={onSelect} style={checkboxContainer} disabled={disabled}>
      <View style={[checkbox, isSelected && checkboxSelected]}>
        <CheckRender allowed={isSelected}>
          <View style={iconContainer}>
            <IconCheckSVG />
          </View>
        </CheckRender>
      </View>
      <View style={labelContainer}>
        <Text style={[labelStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

CustomCheckbox.defaultProps = {
  label: "",
  isSelected: false,
  onSelect: () => {},
  disabled: false,
  containerCheck: Styles.containerCheck,
  checkboxContainer: Styles.checkboxContainer,
  labelContainer: Styles.labelContainer,
  labelStyle: Styles.labelStyle,
  iconContainer: Styles.iconContainer,
  checkbox: Styles.checkbox,
  checkboxSelected: Styles.checkboxSelected
};

export default CustomCheckbox;
