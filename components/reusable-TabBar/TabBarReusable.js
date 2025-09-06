import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Componente de barra de pestañas reutilizable
 * @param {Array} tabs - Array de objetos con formato {key: string, label: string, leftIcon: Component, rightIcon: Component, showLeftIcon: boolean, showRightIcon: boolean, disabled: boolean}
 * @param {string} selectedTab - Key de la pestaña seleccionada
 * @param {Function} onTabChange - Función callback que se ejecuta al cambiar de pestaña
 * @param {Object} containerStyle - Estilo para el contenedor principal de pestañas
 * @param {Object} tabStyle - Estilo para el contenedor de cada pestaña
 * @param {Object} selectedTabStyle - Estilo adicional para la pestaña seleccionada
 * @param {Object} disabledTabStyle - Estilo adicional para las pestañas deshabilitadas
 * @param {Object} labelStyle - Estilo base para el texto de las pestañas
 * @param {Object} selectedLabelStyle - Estilo adicional para el texto de la pestaña seleccionada
 * @param {Object} disabledLabelStyle - Estilo adicional para el texto de pestañas deshabilitadas
 * @param {Object} iconContainerStyle - Estilo para los contenedores de iconos
 * @returns {JSX.Element}
 */
const TabBarReusable = ({
  tabs = [],
  selectedTab,
  onTabChange,
  containerStyle,
  tabStyle,
  selectedTabStyle,
  disabledTabStyle,
  labelStyle,
  selectedLabelStyle,
  disabledLabelStyle,
  iconContainerStyle
}) => (
  <View style={[styles.tabContainer, containerStyle]}>
    {tabs.map((tab) => {
      const isSelected = selectedTab === tab.key;
      const isDisabled = tab.disabled;

      return (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabTouchable}
          onPress={() => {
            onTabChange(tab.key);
          }}
          disabled={isDisabled}>
          <View
            style={[
              styles.tabItemContainer,
              tabStyle,
              isSelected && [styles.tabItemSelected, selectedTabStyle],
              !isSelected && styles.tabItemNonSelected,
              isDisabled && [styles.tabItemDisabled, disabledTabStyle]
            ]}>
            {/* Icono izquierdo */}
            {tab.leftIcon && tab.showLeftIcon !== false && (
              <View style={[styles.iconContainer, styles.leftIconContainer, iconContainerStyle]}>{tab.leftIcon}</View>
            )}

            <Text
              style={[
                styles.tabTextBase,
                labelStyle,
                isSelected && [styles.tabTextSelected, selectedLabelStyle],
                !isSelected && styles.tabTextNonSelected,
                isDisabled && [styles.tabTextDisabled, disabledLabelStyle]
              ]}>
              {tab.label}
            </Text>

            {/* Icono derecho */}
            {tab.rightIcon && tab.showRightIcon !== false && (
              <View style={[styles.iconContainer, styles.rightIconContainer, iconContainerStyle]}>{tab.rightIcon}</View>
            )}
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row"
  },
  tabTouchable: {
    flex: 1
  },
  tabItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderBottomWidth: 2
  },
  tabItemSelected: {
    borderColor: "#009ed4"
  },
  tabItemNonSelected: {
    borderColor: "rgba(0, 158, 212, 0.2)",
    borderBottomWidth: 1
  },
  tabItemDisabled: {
    opacity: 0.5
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  leftIconContainer: {
    marginRight: 8
  },
  rightIconContainer: {
    marginLeft: 8
  },
  tabTextBase: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "SF Pro"
  },
  tabTextSelected: {
    fontWeight: "600",
    color: "#565e73"
  },
  tabTextNonSelected: {
    color: "#6b758c"
  },
  tabTextDisabled: {
    color: "#9e9e9e"
  }
});

export default TabBarReusable;
