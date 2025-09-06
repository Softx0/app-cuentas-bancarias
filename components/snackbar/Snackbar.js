import React, { useEffect, useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import CheckCircleSVGwhite from "../../assets/icons/check-success-white.svg";
import { SnackbarColors, SnackbarStyles } from "./styles/SnackbarStyles";

/**
 * Componente Snackbar para mostrar mensajes temporales.
 *
 * @param {string} message - El mensaje que se mostrará en el Snackbar.
 * @param {string} actionText - Texto del botón de acción.
 * @param {function} onActionPress - Función a ejecutar cuando se presiona el botón de acción.
 * @param {number} duration - Duración en milisegundos para mostrar el Snackbar. Por defecto, 3000 ms.
 * @param {object} containerStyle - Estilos adicionales para el contenedor del Snackbar.
 * @param {object} snackBarContainerStyle - Estilos adicionales para el contenedor del Snackbar.
 * @param {object} iconContainerStyle - Estilos adicionales para el contenedor del icono.
 * @param {object} messageTextStyle - Estilos adicionales para el texto del mensaje.
 * @param {object} actionTextStyle - Estilos adicionales para el texto del botón de acción.
 * @param {string} backgroundColorSnack - Color de fondo del Snackbar. Por defecto, azul (#05A2AF).
 * @param {React.Element} iconComponent - Componente a mostrar como icono en el Snackbar.
 * @param {boolean} visible - Define si el Snackbar es visible o no. Por defecto, true.
 *
 * @returns {JSX.Element|null} El componente Snackbar o null si no es visible.
 */

export const Snackbar = ({
  visible,
  duration,
  iconComponent,
  message,
  actionText,
  onActionPress,
  containerStyle,
  snackBarContainerStyle,
  backgroundColorSnack,
  iconContainerStyle,
  messageTextStyle,
  actionTextStyle
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  // didUpdate manejando la duración que se va a mostrar el Snackbar
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration]);

  return isVisible ? (
    <View style={containerStyle}>
      <View style={[snackBarContainerStyle, { backgroundColor: backgroundColorSnack }]}>
        {iconComponent && <View style={iconContainerStyle}>{iconComponent}</View>}
        <Text style={messageTextStyle}>{message}</Text>
        {actionText && (
          <TouchableOpacity onPress={onActionPress}>
            <Text style={actionTextStyle}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  ) : null;
};

Snackbar.defaultProps = {
  visible: true,
  duration: 3000,
  iconComponent: <CheckCircleSVGwhite />,
  backgroundColorSnack: SnackbarColors.greenSuccess,
  containerStyle: SnackbarStyles.container,
  snackBarContainerStyle: SnackbarStyles.snackBarContainerStyle,
  iconContainerStyle: SnackbarStyles.iconContainerStyle,
  messageTextStyle: SnackbarStyles.messageTextStyle,
  actionTextStyle: SnackbarStyles.actionTextStyle
};
