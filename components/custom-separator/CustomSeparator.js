import React from "react";

import { View } from "react-native";

import Metrics from "../../themes/Metrics";

/**
 * Componente CustomSeparator.
 *
 * Renderiza un separador con el color, altura y ancho especificados.
 *
 * @component
 * @example
 * return (
 *   <CustomSeparator
 *     height={Metrics.mXl}
 *     color="transparent"
 *     width={0}
 *   />
 * );
 *
 * @param {Object} props - Propiedades del componente.
 * @param {number|string} [props.height=Metrics.mXl] - Altura del separador.
 * @param {string} [props.color="transparent"] - Color del separador.
 * @param {number|string} [props.width=0] - Ancho del separador.
 */
const CustomSeparator = (props) => {
  const { height = Metrics.mXl, color = "transparent", width = 0 } = props;

  return (
    <View
      style={{
        backgroundColor: color,
        height,
        width
      }}
    />
  );
};

export default CustomSeparator;
