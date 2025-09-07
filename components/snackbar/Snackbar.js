import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Text, TouchableOpacity, View } from "react-native";

import CheckCircleSVGwhite from "../../assets/icons/check-success-white.svg";
import { SnackbarColors, SnackbarStyles } from "./styles/SnackbarStyles";

/**
 * Componente Snackbar para mostrar mensajes temporales con soporte completo de JSDoc y TypeScript.
 * 
 * @component
 * @example
 * // Uso básico
 * <Snackbar 
 *   message="Operación exitosa" 
 *   visible={true} 
 * />
 * 
 * @example
 * // Con acción personalizada
 * <Snackbar 
 *   message="Error al guardar"
 *   actionText="Reintentar"
 *   onActionPress={() => console.log('Retry')}
 *   backgroundColorSnack="#FF6B6B"
 * />
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.message=""] - El mensaje que se mostrará en el Snackbar
 * @param {string} [props.actionText] - Texto del botón de acción (opcional)
 * @param {function} [props.onActionPress] - Función a ejecutar cuando se presiona el botón de acción
 * @param {number} [props.duration=3000] - Duración en milisegundos para mostrar el Snackbar
 * @param {Object} [props.containerStyle] - Estilos adicionales para el contenedor exterior
 * @param {Object} [props.snackBarContainerStyle] - Estilos adicionales para el contenedor del Snackbar
 * @param {Object} [props.iconContainerStyle] - Estilos adicionales para el contenedor del icono
 * @param {Object} [props.messageTextStyle] - Estilos adicionales para el texto del mensaje
 * @param {Object} [props.actionTextStyle] - Estilos adicionales para el texto del botón de acción
 * @param {string} [props.backgroundColorSnack] - Color de fondo del Snackbar
 * @param {React.Element} [props.iconComponent] - Componente a mostrar como icono en el Snackbar
 * @param {boolean} [props.visible=true] - Define si el Snackbar es visible o no
 * @param {boolean} [props.showDefaultIcon=true] - Si debe mostrar el icono por defecto cuando no se proporciona iconComponent
 * @returns {JSX.Element|null} El componente Snackbar o null si no es visible
 */
export const Snackbar = ({
  visible = true,
  duration = 3000,
  iconComponent = null,
  message = "",
  actionText,
  onActionPress,
  containerStyle = SnackbarStyles.container,
  snackBarContainerStyle = SnackbarStyles.snackBarContainerStyle,
  backgroundColorSnack = SnackbarColors.greenSuccess,
  iconContainerStyle = SnackbarStyles.iconContainerStyle,
  messageTextStyle = SnackbarStyles.messageTextStyle,
  actionTextStyle = SnackbarStyles.actionTextStyle,
  showDefaultIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  // Sync visibility state with visible prop
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  // Handle auto-hide duration
  useEffect(() => {
    if (isVisible && duration > 0) {
      console.log("Snackbar: Auto-hide timer started", JSON.stringify({ duration, message }, null, 2));
      const timeout = setTimeout(() => {
        console.log("Snackbar: Auto-hiding after duration", JSON.stringify({ duration }, null, 2));
        setIsVisible(false);
      }, duration);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isVisible, duration, message]);

  // Memoized icon component with default fallback
  const renderIcon = useMemo(() => {
    if (iconComponent) {
      return iconComponent;
    }
    
    if (showDefaultIcon) {
      return <CheckCircleSVGwhite width={20} height={20} />;
    }
    
    return null;
  }, [iconComponent, showDefaultIcon]);

  // Optimized action handler
  const handleActionPress = useCallback(() => {
    console.log("Snackbar: Action button pressed", JSON.stringify({ actionText, message }, null, 2));
    if (typeof onActionPress === "function") {
      onActionPress();
    }
  }, [onActionPress, actionText, message]);

  // Memoized container styles
  const containerStyles = useMemo(() => [
    snackBarContainerStyle, 
    { backgroundColor: backgroundColorSnack }
  ], [snackBarContainerStyle, backgroundColorSnack]);

  // Early return if not visible
  if (!isVisible) {
    return null;
  }

  console.log("Snackbar: Rendering", JSON.stringify({ 
    message, 
    visible: isVisible, 
    hasIcon: !!renderIcon,
    hasAction: !!actionText 
  }, null, 2));

  return (
    <View style={containerStyle}>
      <View style={containerStyles}>
        {renderIcon && (
          <View style={iconContainerStyle}>
            {renderIcon}
          </View>
        )}
        
        <Text style={messageTextStyle} numberOfLines={2}>
          {message}
        </Text>
        
        {actionText && (
          <TouchableOpacity 
            onPress={handleActionPress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={actionTextStyle}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Snackbar;
