import React from "react";

import PropTypes from "prop-types";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CalendarSVG from "../../assets/icons/calendar-gray.svg";
import CalendarGraySVG from "../../assets/icons/calendar.svg";
import Colors from "../../themes/Colors";
import { FontSize } from "../../themes/Fonts";
import { DATE_FORMATS, formatDateByFormat, obtenerFechaHoy, unAnoHaciaAtras } from "../../utils/DateUtil";
import CheckRender from "../security/CheckRender.js";
import { CalendarReusable } from "./CalendarReusable";

/**
 * Componente reutilizable para mostrar un selector de rango de fechas con calendario
 *
 * @component
 * @example
 * // Uso básico
 * <CalendarPickerRangeReusable
 *   calendarHook={useHumanCalendar()}
 *   title="Seleccionar fechas"
 * />
 *
 * @example
 * // Uso con personalización completa
 * <CalendarPickerRangeReusable
 *   calendarHook={useHumanCalendar()}
 *   title="Período de consulta"
 *   placeholder="Seleccione un rango de fechas"
 *   showModal={true}
 *   modalAnimationType="slide"
 *   dateFormat={DATE_FORMATS.SLASH_DMY}
 *   customStyles={{
 *     container: { marginVertical: 10 },
 *     button: { backgroundColor: '#f0f0f0' },
 *     text: { color: '#333' }
 *   }}
 *   icons={{
 *     empty: <CustomEmptyIcon />,
 *     selected: <CustomSelectedIcon />
 *   }}
 * />
 */
const CalendarPickerRangeReusable = ({
  calendarHook,
  title,
  placeholder,
  showModal = true,
  modalAnimationType = "fade",
  dateFormat = DATE_FORMATS.SLASH_DMY,
  dateSeparator = " - ",
  customStyles = {},
  icons = {},
  onPress,
  disabled = false,
  testID,
  accessibilityLabel,
  accessibilityHint,
  renderCustomButton,
  renderCustomModal,
  showTitle = false,
  emptyStartDateFallback,
  emptyEndDateFallback
}) => {
  // Validación de props requeridas
  if (!calendarHook) {
    console.warn("CalendarPickerRangeReusable: calendarHook es requerido");

    return null;
  }

  const { selectedDates, isVisibleHumanCalendar, invertVisibleHumanCalendar } = calendarHook;

  // Verificar si no hay fechas seleccionadas
  const isNotSelected = selectedDates.startDate === "" && selectedDates.endDate === "";

  // Obtener fechas formateadas o fallbacks
  const getFormattedStartDate = () => {
    if (selectedDates.startDate !== "") {
      return formatDateByFormat(selectedDates.startDate, dateFormat).split("T")[0];
    }

    return emptyStartDateFallback || unAnoHaciaAtras(dateFormat);
  };

  const getFormattedEndDate = () => {
    if (selectedDates.endDate !== "") {
      return formatDateByFormat(selectedDates.endDate, dateFormat).split("T")[0];
    }

    return emptyEndDateFallback || obtenerFechaHoy(dateFormat);
  };

  // Manejar el evento de presionar el botón
  const handlePress = () => {
    if (disabled) return;

    if (onPress) {
      onPress();
    } else {
      invertVisibleHumanCalendar();
    }
  };

  // Obtener el icono apropiado
  const getIcon = () => {
    if (isNotSelected) {
      return icons.empty || <CalendarSVG />;
    }

    return icons.selected || <CalendarGraySVG />;
  };

  // Obtener el texto a mostrar
  const getDisplayText = () => {
    if (isNotSelected && placeholder) {
      return placeholder;
    }

    return `${getFormattedStartDate()}${dateSeparator}${getFormattedEndDate()}`;
  };

  // Estilos combinados
  const combinedStyles = {
    container: [styles.container, customStyles.container],
    button: [styles.dateDisplayButton, disabled && styles.disabledButton, customStyles.button],
    titleText: [styles.titleText, customStyles.titleText],
    text: [styles.dateDisplayText, isNotSelected ? styles.placeholderText : styles.selectedText, disabled && styles.disabledText, customStyles.text],
    iconContainer: [styles.iconContainer, customStyles.iconContainer]
  };

  // Renderizar botón personalizado si se proporciona
  if (renderCustomButton) {
    return (
      <View style={combinedStyles.container}>
        {renderCustomButton({
          onPress: handlePress,
          displayText: getDisplayText(),
          isNotSelected,
          disabled,
          icon: getIcon(),
          selectedDates,
          title
        })}
        {renderCalendarModal()}
      </View>
    );
  }

  // Renderizar modal del calendario
  const renderCalendarModal = () => {
    if (!showModal) return null;

    const modalContent = (
      <CalendarReusable
        {...selectedDates}
        onApplyDates={calendarHook.onApplyDates}
        cancelButton={invertVisibleHumanCalendar}
        {...calendarHook.getCalendarConfig()}
      />
    );

    if (renderCustomModal) {
      return renderCustomModal({
        visible: isVisibleHumanCalendar,
        onClose: invertVisibleHumanCalendar,
        children: modalContent
      });
    }

    return (
      <Modal transparent={true} animationType={modalAnimationType} visible={isVisibleHumanCalendar} onRequestClose={invertVisibleHumanCalendar}>
        {modalContent}
      </Modal>
    );
  };

  return (
    <View style={combinedStyles.container}>
      {/* Título opcional */}
      {showTitle && title && <Text style={combinedStyles.titleText}>{title}</Text>}

      {/* CheckRender para mostrar el botón cuando el calendario no está visible */}
      <CheckRender allowed={!isVisibleHumanCalendar}>
        <TouchableOpacity
          style={combinedStyles.button}
          onPress={handlePress}
          activeOpacity={disabled ? 1 : 0.7}
          disabled={disabled}
          testID={testID}
          accessibilityLabel={accessibilityLabel || `Selector de fechas: ${getDisplayText()}`}
          accessibilityHint={accessibilityHint || "Toca para abrir el calendario"}
          accessibilityRole="button">
          <View style={combinedStyles.iconContainer}>{getIcon()}</View>
          <View style={{ flex: 1 }}>
            <Text style={combinedStyles.text}>{getDisplayText()}</Text>
          </View>
        </TouchableOpacity>
      </CheckRender>

      {/* CheckRender para mostrar el calendario cuando está visible */}
      <CheckRender allowed={isVisibleHumanCalendar}>{renderCalendarModal()}</CheckRender>
    </View>
  );
};

/**
 * PropTypes para validación de tipos
 */
CalendarPickerRangeReusable.propTypes = {
  /** Hook del calendario (useHumanCalendar) - REQUERIDO */
  calendarHook: PropTypes.shape({
    selectedDates: PropTypes.shape({
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    }).isRequired,
    isVisibleHumanCalendar: PropTypes.bool.isRequired,
    invertVisibleHumanCalendar: PropTypes.func.isRequired,
    onApplyDates: PropTypes.func.isRequired,
    getCalendarConfig: PropTypes.func.isRequired
  }).isRequired,

  /** Título del componente */
  title: PropTypes.string,

  /** Texto placeholder cuando no hay fechas seleccionadas */
  placeholder: PropTypes.string,

  /** Si debe mostrar el modal del calendario */
  showModal: PropTypes.bool,

  /** Tipo de animación del modal */
  modalAnimationType: PropTypes.oneOf(["none", "slide", "fade"]),

  /** Formato de fecha a usar */
  dateFormat: PropTypes.string,

  /** Separador entre fechas */
  dateSeparator: PropTypes.string,

  /** Estilos personalizados */
  customStyles: PropTypes.shape({
    container: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    button: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleText: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    text: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iconContainer: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }),

  /** Iconos personalizados */
  icons: PropTypes.shape({
    empty: PropTypes.element,
    selected: PropTypes.element
  }),

  /** Función personalizada al presionar */
  onPress: PropTypes.func,

  /** Si el componente está deshabilitado */
  disabled: PropTypes.bool,

  /** ID para testing */
  testID: PropTypes.string,

  /** Label de accesibilidad */
  accessibilityLabel: PropTypes.string,

  /** Hint de accesibilidad */
  accessibilityHint: PropTypes.string,

  /** Función para renderizar botón personalizado */
  renderCustomButton: PropTypes.func,

  /** Función para renderizar modal personalizado */
  renderCustomModal: PropTypes.func,

  /** Si debe mostrar el título */
  showTitle: PropTypes.bool,

  /** Fallback para fecha de inicio vacía */
  emptyStartDateFallback: PropTypes.string,

  /** Fallback para fecha de fin vacía */
  emptyEndDateFallback: PropTypes.string
};

/**
 * Valores por defecto de las props
 */
CalendarPickerRangeReusable.defaultProps = {
  title: "",
  placeholder: "",
  showModal: true,
  modalAnimationType: "fade",
  dateFormat: DATE_FORMATS.SLASH_DMY,
  dateSeparator: " - ",
  customStyles: {},
  icons: {},
  onPress: null,
  disabled: false,
  testID: "calendar-picker-range",
  accessibilityLabel: null,
  accessibilityHint: null,
  renderCustomButton: null,
  renderCustomModal: null,
  showTitle: false,
  emptyStartDateFallback: null,
  emptyEndDateFallback: null
};

/**
 * Estilos por defecto del componente
 */
const styles = StyleSheet.create({
  container: {
    marginBottom: 8
  },
  titleText: {
    fontSize: FontSize.small,
    fontWeight: "500",
    color: Colors.neutral[500],
    marginBottom: 4
  },
  dateDisplayButton: {
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E5E9"
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0"
  },
  dateDisplayText: {
    fontFamily: "SF Pro",
    fontSize: 16,
    fontWeight: "500"
  },
  selectedText: {
    color: "#515151"
  },
  placeholderText: {
    color: "#ADB6C3"
  },
  disabledText: {
    color: "#CCCCCC"
  },
  iconContainer: {
    marginRight: 20
  }
});

export default CalendarPickerRangeReusable;
