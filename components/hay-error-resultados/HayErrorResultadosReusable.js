/**
 * @file HayErrorReusable.js
 * @description Componente reutilizable que muestra un mensaje de error con una imagen, texto descriptivo y botones de acción.
 * @module components/common/HayErrorReusable
 * @requires react, react-native
 */
import React from "react";

import { Text, View } from "react-native";

import ErrorObtenerDatosSVG from "../../assets/icons/error-obtener-datos.svg";
import CustomButton from "../../components/custom-button/ButtonLiteReusable";
import styles from "./HayErrorResultadosReusableStyles";

/**
 * Componente HayErrorReusable
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.title="¡Oops, algo salió mal!"] - Título principal a mostrar
 * @param {string} [props.subtitle="Error en el servidor, lo sentimos, ha\n ocurrido un error al mostrar la\n información."] - Subtítulo descriptivo
 * @param {string} [props.primaryButtonText="Reintentar"] - Texto del botón principal
 * @param {string} [props.secondaryButtonText="Volver al inicio"] - Texto del botón secundario
 * @param {function} props.onPrimaryButtonPress - Función a ejecutar al presionar el botón principal
 * @param {function} props.onSecondaryButtonPress - Función a ejecutar al presionar el botón secundario
 * @param {boolean} [props.showSecondaryButton=true] - Si mostrar o no el botón secundario
 * @param {Object} [props.customStyles={}] - Estilos personalizados para sobreescribir los estilos por defecto
 * @returns {React.Component} Componente HayErrorReusable
 */
const HayErrorResultadosReusable = ({
  title = "¡Oops, algo salió mal!",
  subtitle = "Error en el servidor, lo sentimos, ha\n ocurrido un error al mostrar la\n información.",
  primaryButtonText = "Volver al inicio",
  secondaryButtonText = "Reintentar",
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  showSecondaryButton = true,
  customStyles = {}
}) => {
  // Combinar estilos personalizados con los estilos por defecto
  const mergedStyles = {
    container: { ...styles.container, ...customStyles.container },
    titleContainer: { ...styles.titleContainer, ...customStyles.titleContainer },
    title: { ...styles.title, ...customStyles.title },
    subtitleContainer: { ...styles.subtitleContainer, ...customStyles.subtitleContainer },
    subtitle: { ...styles.subtitle, ...customStyles.subtitle },
    buttonsContainer: { ...styles.buttonsContainer, ...customStyles.buttonsContainer },
    buttonContainer: { ...styles.buttonContainer, ...customStyles.buttonContainer }
  };

  return (
    <View style={mergedStyles.container}>
      <View>
        <ErrorObtenerDatosSVG />
      </View>

      <View style={mergedStyles.titleContainer}>
        <Text style={mergedStyles.title}>{title}</Text>
      </View>

      <View style={mergedStyles.subtitleContainer}>
        <Text style={mergedStyles.subtitle}>{subtitle}</Text>
      </View>

      <View style={mergedStyles.buttonsContainer}>
        <View style={mergedStyles.buttonContainer}>
          <CustomButton
            title={primaryButtonText}
            onPress={onPrimaryButtonPress}
            backgroundColor="#FFFFFF"
            height={50}
            container={styles.secondaryButtonCustomContainer}
            titleStyles={styles.secondaryButtonTitleStyles}
            fontSize={14}
            textColor="#6B758C"
          />
        </View>
        {showSecondaryButton && (
          <View style={mergedStyles.buttonContainer}>
            <CustomButton
              title={secondaryButtonText}
              onPress={onSecondaryButtonPress}
              backgroundColor="#DEF5FF"
              height={50}
              container={styles.primaryButtonCustomContainer}
              titleStyles={styles.primaryButtonTitleStyles}
              fontSize={14}
              textColor="#006A8D"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HayErrorResultadosReusable;
