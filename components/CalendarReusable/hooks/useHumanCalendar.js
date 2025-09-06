import { useState } from "react";

/**
 * Hook personalizado para manejar el estado del calendario CalendarReusable
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.enableDateRangeInputs - Muestra inputs de rango de fechas editables
 * @param {boolean} options.canBeSameDay - Permite seleccionar la misma fecha como inicio y fin
 * @param {Date} options.minDate - Fecha mínima seleccionable
 * @param {Date} options.maxDate - Fecha máxima seleccionable
 * @param {Date} options.initialStartDate - Fecha inicial de inicio
 * @param {Date} options.initialEndDate - Fecha inicial de fin
 * @returns {Object} Estado y funciones del calendario
 */
const useHumanCalendar = (options = {}) => {
  const {
    enableDateRangeInputs = false,
    canBeSameDay = false,
    minDate = new Date(new Date().getFullYear() - 1, 0, 1), // Un año atrás
    maxDate = new Date(), // Hoy
    initialStartDate = "",
    initialEndDate = "" // new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) // Una semana adelante
  } = options;

  const [selectedDates, setSelectedDates] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate
  });

  const [isVisibleHumanCalendar, setIsVisibleHumanCalendar] = useState(false);

  const invertVisibleHumanCalendar = () => setIsVisibleHumanCalendar((prevState) => !prevState);

  // this.props.canBeSameDay && !this.state.selectedEndDate
  const onApplyDates = (startDate, endDate) => {
    if (canBeSameDay && !endDate) {
      setSelectedDates({ startDate, endDate: startDate });
    } else {
      setSelectedDates({ startDate, endDate });
    }

    invertVisibleHumanCalendar();
  };

  console.log("selectedDates: ", selectedDates);

  /**
   * Configuración del calendario con feature flags
   */
  const getCalendarConfig = () => ({
    enableDateRangeInputs,
    canBeSameDay,
    minDate,
    maxDate
  });

  return {
    selectedDates,
    isVisibleHumanCalendar,
    invertVisibleHumanCalendar,
    onApplyDates,
    getCalendarConfig,
    // Feature flags para fácil acceso
    featureFlags: {
      enableDateRangeInputs,
      canBeSameDay
    }
  };
};

export default useHumanCalendar;
