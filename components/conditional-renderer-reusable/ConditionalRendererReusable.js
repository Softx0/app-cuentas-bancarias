import React from "react";

import themes from "../../themes";
import HayErrorResultadosReusable from "../hay-error-resultados/HayErrorResultadosReusable";
import Loading from "../loading/Loading";
import NoHayResultadosReusable from "../no-hay-resultados/NoHayResultadosReusable";

/**
 * Componente contenedor que muestra dinámicamente un mensaje de error o de "no hay resultados" o un loading,
* según los estados recibidos por props. Si no hay ningún estado especial activo, renderiza los children.
 *
 * @component
 *
 * @param {Object} props
 * @param {boolean} [props.hasError=false] - Indica si ocurrió un error
 * @param {boolean} [props.hasNoResults=false] - Indica si no hay resultados para mostrar
 * @param {boolean} [props.hasLoading=false] - Indica si se debe mostrar un loading
 * @param {Function} [props.onRetry=() => {}] - Función a ejecutar al presionar "Reintentar"
 * @param {Function} props.onBack - Función a ejecutar al presionar "Volver al inicio"
 * @param {Object} [props.customStyles={}] - Estilos personalizados para los componentes internos
 * @param {Object} [props.texts={}] - Textos personalizados para error y no resultados
 * @param {string} [props.texts.errorTitle] - Título personalizado del mensaje de error
 * @param {string} [props.texts.errorSubtitle] - Subtítulo personalizado del mensaje de error
 * @param {string} [props.texts.emptyTitle] - Título personalizado del mensaje de "no hay resultados"
 * @param {string} [props.texts.emptySubtitle] - Subtítulo personalizado del mensaje de "no hay resultados"
 * @param {string} [props.texts.backText] - Texto para el botón de volver
 * @param {string} [props.texts.retryText] - Texto para el botón de reintentar
 * @param {string} [props.texts.loadingColor] - Color del loading
 * @param {React.ReactNode} [props.children] - Contenido a renderizar cuando no hay estados especiales activos
 * @returns {React.Component|null}
 */
const ConditionalRendererReusable = ({
  hasError = false,
  hasNoResults = false,
  hasLoading = false,
  onRetry = () => {},
  onBack,
  customStyles = {},
  texts = {},
  children
}) => {
  const {
    errorTitle = "¡Oops, algo salió mal!",
    errorSubtitle = "Error en el servidor, lo sentimos, ha\n ocurrido un error al mostrar la\n información.",
    emptyTitle = "¡No hay resultados!",
    emptySubtitle = "No hay resultados que coincidan con tu\n búsqueda. Intenta con algo diferente.",
    backText = "Volver al inicio",
    retryText = "Reintentar",
    loadingColor = themes.Colors.primary
  } = texts;

  if (hasError) {
    return (
      <HayErrorResultadosReusable
        title={errorTitle}
        subtitle={errorSubtitle}
        primaryButtonText={backText}
        secondaryButtonText={retryText}
        onPrimaryButtonPress={onBack}
        onSecondaryButtonPress={onRetry}
        customStyles={customStyles}
      />
    );
  }

  if (hasNoResults) {
    return <NoHayResultadosReusable title={emptyTitle} subtitle={emptySubtitle} buttonText={backText} onButtonPress={onBack} customStyles={customStyles} />;
  }

  if (hasLoading) {
    return <Loading color={loadingColor} isLoading={true} />;
  }

  // Si no hay ningún estado especial activo, renderizar los children
  return children || null;
};

export default ConditionalRendererReusable;
