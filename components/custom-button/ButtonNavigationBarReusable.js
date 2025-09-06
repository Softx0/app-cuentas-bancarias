import React, { useState } from "react";

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * BOTTOM NAVIGATION BAR - Multi-button navigation component for tab-based interfaces
 * 
 * **PURPOSE**: Creates a bottom navigation bar with multiple action buttons, each with 
 * icons and labels. Designed for tab navigation, action toolbars, and multi-function interfaces.
 * 
 * **WHEN TO USE**:
 * - Bottom tab navigation (Home, Profile, Settings, etc.)
 * - Action toolbars (Edit, Delete, Share, etc.)
 * - Multi-step form navigation
 * - Dashboard quick actions
 * - Document/media viewers with multiple tools
 * 
 * **VISUAL CHARACTERISTICS**:
 * - Horizontal layout with equally spaced buttons
 * - Icons above or below text labels
 * - Active state indicator (blue underline bar)
 * - Loading states with spinners
 * - Disabled states with reduced opacity
 * - Flexible icon positioning
 * - Customizable styling per button
 * 
 * @component
 * @example
 * // Basic navigation bar
 * const navButtons = [
 *   {
 *     titleButton: "Home",
 *     onPressActionButton: () => navigate('Home'),
 *     iconButton: <HomeIcon />
 *   },
 *   {
 *     titleButton: "Profile", 
 *     onPressActionButton: () => navigate('Profile'),
 *     iconButton: <ProfileIcon />
 *   }
 * ];
 * 
 * <ButtonNavigationBarReusable 
 *   buttons={navButtons}
 *   showIndicator={true}
 * />
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.buttons - Array of button configuration objects
 * @param {string} props.buttons[].titleButton - Text to display on the button
 * @param {Function} props.buttons[].onPressActionButton - Function called when button is pressed
 * @param {boolean} [props.buttons[].disabled=false] - Whether button is disabled
 * @param {Object} [props.buttons[].buttonStyle] - Custom styles for button container
 * @param {Object} [props.buttons[].titleButtonStyle] - Custom styles for button text
 * @param {boolean} [props.buttons[].loading=false] - Whether to show loading spinner
 * @param {React.ReactNode} [props.buttons[].iconButton] - Icon component when enabled
 * @param {React.ReactNode} [props.buttons[].iconDisabled] - Icon component when disabled
 * @param {Object} [props.buttons[].iconStyle] - Custom styles for icon container
 * @param {string} [props.buttons[].iconPosition="above"] - Icon position ("above" or "below")
 * @param {boolean} [props.buttons[].showIcon=true] - Whether to show the icon
 * @param {string} [props.buttons[].accessibilityLabel] - Accessibility label
 * @param {Object} [props.buttons[].hitSlop] - Hit slop for button
 * @param {number} [props.buttons[].activeOpacity=0.7] - Active opacity when pressed
 * @param {string} [props.buttons[].colorLoading="#4A9ED4"] - Loading spinner color
 * @param {number} [props.buttons[].iconSize] - Icon size in pixels
 * @param {boolean} [props.showIndicator=true] - Whether to show active button indicator
 * @returns {React.ReactElement} Bottom navigation bar component
 *
 * @example
 * // Configuración de botones personalizados
 * const botones = [
 *   {
 *     titleButton: "Emitir",
 *     onPressActionButton: () => console.log("Emitir Presionado"),
 *     disabled: false,
 *     // buttonStyle: { backgroundColor: "lightblue" },
 *     titleButtonStyle: { color: "blue" },
 *     loading: false,
 *     iconButton: <IconEnviarAzul />,
 *     iconDisabled: <IconEnviarGris />, // Icono para mostrar cuando está deshabilitado
 *     iconStyle: { marginBottom: 5 },
 *     iconPosition: "above", // Posición arriba
 *     showIcon: true,
 *     accessibilityLabel: "Botón Emitir",
 *     hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
 *     activeOpacity: 0.7,
 *     colorLoading: "blue",
 *     iconSize: 24 // Tamaño del ícono
 *   },
 *   {
 *     titleButton: "Modificar",
 *     onPressActionButton: () => console.log("Modificar Presionado"),
 *     disabled: true,
 *     buttonStyle: {},
 *     titleButtonStyle: {},
 *     loading: false,
 *     iconButton: <IconLapizAzulSVG />,
 *     iconDisabled: <IconLapizGrisSVG />, // Mostrará este icono ya que disabled es true
 *     iconStyle: { marginBottom: 5 },
 *     iconPosition: "above",
 *     showIcon: true,
 *     accessibilityLabel: "Botón Modificar",
 *     hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
 *     activeOpacity: 0.7,
 *     colorLoading: "blue",
 *     iconSize: 30 // Tamaño del ícono
 *   },
 *   // Otros botones...
 * ];
 *
 * // Uso con indicador visible
 * <ButtonNavigationBarReusable buttons={botones} showIndicator={true} />
 *
 * // Uso con indicador oculto
 * <ButtonNavigationBarReusable buttons={botones} showIndicator={false} />
 */
const ButtonNavigationBarReusable = ({ buttons, showIndicator = true }) => {
  // Estado para rastrear el índice del botón activo
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);

  /**
   * Maneja el evento de presionar un botón
   * @param {number} index - Índice del botón presionado
   * @param {Function} onPressAction - Función de acción del botón
   */
  const handlePress = (index, onPressAction) => {
    // Ejecuta la función de acción si existe
    if (onPressAction) {
      onPressAction();
    }

    // Actualiza el botón activo
    setActiveButtonIndex(index);
  };

  /**
   * Renderiza el icono apropiado según el estado del botón
   * @param {Object} button - Configuración del botón
   * @returns {React.ReactNode} Componente de icono
   */
  const renderIcon = (button) => {
    // Muestra el indicador de carga si loading es true
    if (button.loading) {
      return <ActivityIndicator color={button.colorLoading || "#4A9ED4"} />;
    }

    // Muestra el icono deshabilitado si el botón está deshabilitado y hay un iconDisabled
    if (button.disabled && button.iconDisabled) {
      return button.iconDisabled;
    }

    // Muestra el icono normal
    return button.iconButton;
  };

  return (
    <View style={styles.bottomNav}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.navButton, button.buttonStyle, button.disabled && styles.disabledButton]}
          onPress={() => handlePress(index, button.onPressActionButton)}
          disabled={button.disabled}
          accessibilityLabel={button.accessibilityLabel}
          hitSlop={button.hitSlop}
          activeOpacity={button.activeOpacity || 0.7}>
          {/* Icono arriba del texto */}
          {button.iconPosition === "above" && button.showIcon && <View style={[styles.iconContainer, button.iconStyle]}>{renderIcon(button)}</View>}

          {/* Texto del botón */}
          <Text style={[styles.navButtonText, button.titleButtonStyle, button.disabled && styles.disabledButtonText]}>{button.titleButton}</Text>

          {/* Icono debajo del texto */}
          {button.iconPosition === "below" && button.showIcon && <View style={[styles.iconContainer, button.iconStyle]}>{renderIcon(button)}</View>}

          {/* Indicador de botón activo (se muestra solo si showIndicator es true) */}
          {showIndicator && activeButtonIndex === index && <View style={styles.homeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5"
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    position: "relative",
    paddingVertical: 4
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  navButtonText: {
    color: "#4A9ED4",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontWeight: "400"
  },
  homeIndicator: {
    height: 3,
    width: "70%",
    backgroundColor: "#4A9ED4",
    borderRadius: 2,
    marginTop: 5,
    position: "absolute",
    bottom: -1,
    alignSelf: "center"
  },
  disabledButton: {
    // backgroundColor: "#EAECEFFF",
    backgroundColor: "white",
    opacity: 0.7,
    borderRadius: 5
  },
  disabledButtonText: {
    color: "#8D8F94FF",
    fontWeight: "700"
  }
});

export default ButtonNavigationBarReusable;
