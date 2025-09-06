import React from "react";

import { Text, View } from "react-native";

import CheckRender from "../../security/CheckRender.js";
import Styles from "../styles/PillStyles.js";

/**
 * Componente Pill
 *
 * @param {boolean} props.visible - Indica si el componente es visible
 * @param {string} props.label - Texto que se mostrará dentro del componente
 * @param {object} props.containerStyle - Estilos del contenedor del componente
 * @param {string} props.backgroundColor - Color de fondo del componente
 * @param {string} props.borderColor - Color del borde del componente
 * @param {number} props.borderWidth - Ancho del borde del componente
 * @param {number} props.borderRadius - Radio de borde del componente
 * @param {object} props.labelStyles - Estilos del texto dentro del componente
 * @returns {JSX.Element} Componente Pill
 */

const Pill = ({ visible, label, containerStyle, backgroundColor, borderColor, borderWidth, borderRadius, labelStyles }) => (
  <CheckRender allowed={visible}>
    <View style={containerStyle}>
      <View style={[Styles.Pillcontainer, { backgroundColor, borderWidth, borderColor, borderRadius }]}>
        <Text style={labelStyles}>{label}</Text>
      </View>
    </View>
  </CheckRender>
);

Pill.defaultProps = {
  visible: false
};

export default Pill;
