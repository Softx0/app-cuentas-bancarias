/**
 * @file NoHayResultadosReusable.js
 * @description Componente reutilizable que muestra un mensaje de "No hay resultados" con una imagen, texto descriptivo y un botón de acción.
 * @module components/common/NoHayResultadosReusable
 * @requires react, react-native
 */
import React from "react";

import { Text, View } from "react-native";

import NoHayDatosSVG from "../../assets/icons/no-hay-datos.svg";
import CustomButton from "../../components/custom-button/ButtonLiteReusable";
import styles from "./NoHayResultadosReusableStyles";

/**
 * Componente NoHayResultadosReusable
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.title="¡No hay resultados!"] - Título principal a mostrar
 * @param {string} [props.subtitle="No hay resultados que coincidan con tu\n búsqueda. Intenta con algo diferente."] - Subtítulo descriptivo
 * @param {string} [props.buttonText="Volver al inicio"] - Texto del botón
 * @param {function} props.onButtonPress - Función a ejecutar al presionar el botón
 * @param {Object} [props.customStyles={}] - Estilos personalizados para sobreescribir los estilos por defecto
 * @returns {React.Component} Componente NoHayResultadosReusable
 */
const NoHayResultadosReusable = ({
  title = "¡No hay resultados!",
  subtitle = "No hay resultados que coincidan con tu\n búsqueda. Intenta con algo diferente.",
  buttonText = "Volver al inicio",
  onButtonPress,
  customStyles = {}
}) => {
  // Combinar estilos personalizados con los estilos por defecto
  const mergedStyles = {
    container: { ...styles.container, ...customStyles.container },
    titleContainer: { ...styles.titleContainer, ...customStyles.titleContainer },
    title: { ...styles.title, ...customStyles.title },
    subtitleContainer: { ...styles.subtitleContainer, ...customStyles.subtitleContainer },
    subtitle: { ...styles.subtitle, ...customStyles.subtitle },
    buttonContainer: { ...styles.buttonContainer, ...customStyles.buttonContainer }
  };

  return (
    <View style={mergedStyles.container}>
      <View>
        <NoHayDatosSVG />
      </View>

      <View style={mergedStyles.titleContainer}>
        <Text style={mergedStyles.title}>{title}</Text>
      </View>

      <View style={mergedStyles.subtitleContainer}>
        <Text style={mergedStyles.subtitle}>{subtitle}</Text>
      </View>

      <View style={mergedStyles.buttonContainer}>
        <CustomButton
          title={buttonText}
          onPress={onButtonPress}
          backgroundColor="#FFFFFF"
          height={50}
          container={styles.buttonCustomContainer}
          titleStyles={styles.buttonTitleStyles}
          fontSize={14}
          textColor="#6B758C"
        />
      </View>
    </View>
  );
};

export default NoHayResultadosReusable;
