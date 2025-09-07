/**
 * @providesModule Separador
 */
import React from "react";

import { ActivityIndicator } from "react-native";
import Colors from "../../themes/Colors";
import Metrics from "../../themes/Metrics";

/**
 * Componente CustomLoading.
 *
 * Muestra un indicador de actividad (ActivityIndicator) con los estilos y colores definidos.
 *
 * @component
 * @example
 * return (
 *   <CustomLoading
 *     size="large"
 *     color={Colors.primary}
 *     style={AppStyles.loading}
 *   />
 * );
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.size="large"] - Tamaño del indicador. Valores posibles: "large" o "small".
 * @param {string} [props.color=Colors.primary] - Color del indicador.
 * @param {Object} [props.style=AppStyles.loading] - Estilos personalizados que se aplican al ActivityIndicator.
 */
export default function CustomLoading(props) {
  const { size = "large", color = Colors.primary, style ={
    padding: Metrics.xLarge,
    color: Colors.primary
  } } = props;

  return <ActivityIndicator size={size} color={color} style={style} />;
}
