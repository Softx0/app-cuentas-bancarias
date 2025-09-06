import React from "react";

import { ActivityIndicator } from "react-native";

import Colors from "../../themes/Colors";
import Metrics from "../../themes/Metrics";
import CheckRender from "../security/CheckRender";

/**
 * Componente Loading.
 *
 * Muestra un indicador de actividad (ActivityIndicator) basado en la propiedad `isLoading`.
 * Además, si se establece la propiedad `bottomSeparate`, se renderiza un Separator debajo del indicador.
 *
 * @component
 * @example
 * return (
 *   <Loading
 *     isLoading={true}
 *     size="large"
 *     color={Colors.primary}
 *     bottomSeparate={true}
 *   />
 * );
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} [props.isLoading=false] - Bandera que indica si se muestra el ActivityIndicator.
 * @param {string} [props.color=Colors.primary] - Color del indicador.
 * @param {"large"|"small"|number} [props.size="large"] - Tamaño del indicador. Puede ser "large", "small" o un número.
 * @param {boolean} [props.bottomSeparate] - Bandera que indica si se muestra un Separator debajo.
 * @param {Object} [props.style] - Estilos adicionales a aplicar en el ActivityIndicator.
 */
const Loading = (props) => (
  <CheckRender allowed={props.isLoading}>
    <ActivityIndicator
      {...props}
      color={props.color}
      size={(props.size === "large" && scaleModerate(30)) || (props.size === "small" && scaleModerate(20)) || props.size}
    />
    <CheckRender allowed={props.bottomSeparate}>
      <Separator />
    </CheckRender>
  </CheckRender>
);

const defaultProps = {
  size: "large",
  color: Colors.primary,
  style: {
    padding: scaleModerate(Metrics.medium)
  },
  isLoading: false
};

Loading.defaultProps = defaultProps;

export default React.memo(Loading);
