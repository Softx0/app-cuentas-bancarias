import React, { useState } from "react";

import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import Colors from "../../themes/Colors";
import { FontSize } from "../../themes/Fonts";

/**
 * Componente que muestra dos inputs para mostrar y editar las fechas seleccionadas
 * @param {Object} props - Propiedades del componente
 * @param {Date} props.startDate - Fecha de inicio seleccionada
 * @param {Date} props.endDate - Fecha de fin seleccionada
 * @param {Function} props.onStartDateChange - Callback para cambio de fecha de inicio
 * @param {Function} props.onEndDateChange - Callback para cambio de fecha de fin
 * @param {Date} props.minDate - Fecha mínima permitida
 * @param {Date} props.maxDate - Fecha máxima permitida
 * @param {Object} props.containerStyle - Estilos personalizados para el contenedor
 * @param {Object} props.inputStyle - Estilos personalizados para los inputs
 * @param {Object} props.labelStyle - Estilos personalizados para las etiquetas
 * @param {string} props.dateFormat - Formato de fecha a mostrar
 */
const DateRangeInputs = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  containerStyle,
  inputStyle,
  labelStyle,
  dateFormat = "DD MMM, YYYY"
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";

    return moment(date).format(dateFormat);
  };

  const handleStartDateConfirm = (date) => {
    setShowStartPicker(false);
    onStartDateChange(date);
  };

  const handleEndDateConfirm = (date) => {
    setShowEndPicker(false);
    onEndDateChange(date);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputsRow}>
        {/* Input de fecha de inicio */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.input, inputStyle]}
            // onPress={() => setShowStartPicker(true)}
            activeOpacity={0.7}>
            <Text style={[styles.inputText, startDate && styles.inputTextSelected]}>{formatDate(startDate)}</Text>
          </View>
        </View>

        {/* Separador */}
        <View style={styles.separatorContainer}>
          <Text style={styles.separatorText}>–</Text>
        </View>

        {/* Input de fecha de fin */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.input, inputStyle]}
            // onPress={() => setShowEndPicker(true)}
            activeOpacity={0.7}>
            <Text style={[styles.inputText, endDate && styles.inputTextSelected]}>{formatDate(endDate)}</Text>
          </View>
        </View>
      </View>

      {/* DatePicker para fecha de inicio */}
      <DateTimePicker
        isVisible={showStartPicker}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setShowStartPicker(false)}
        date={startDate || new Date()}
        minimumDate={minDate}
        maximumDate={endDate || maxDate}
        confirmTextIOS="Aceptar"
        cancelTextIOS="Cancelar"
        titleIOS="Seleccionar fecha de inicio"
        locale="es-ES"
        display="spinner"
      />

      {/* DatePicker para fecha de fin */}
      <DateTimePicker
        isVisible={showEndPicker}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setShowEndPicker(false)}
        date={endDate || new Date()}
        minimumDate={startDate || minDate}
        maximumDate={maxDate}
        confirmTextIOS="Aceptar"
        cancelTextIOS="Cancelar"
        titleIOS="Seleccionar fecha de fin"
        locale="es-ES"
        display="spinner"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4
  },
  inputsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  inputContainer: {
    flex: 1
  },
  input: {
    borderWidth: 1,
    borderColor: "#B3B9C6",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    minHeight: 48,
    justifyContent: "center"
  },
  inputText: {
    fontSize: FontSize.subtitle,
    color: Colors.neutral[500],
    textAlign: "center"
  },
  inputTextSelected: {
    color: "#464C5E",
    fontWeight: "400",
    lineHeight: 24
  },
  separatorContainer: {
    paddingHorizontal: 12
  },
  separatorText: {
    fontSize: FontSize.subtitle,
    color: "#6B758C",
    fontWeight: "400",
    lineHeight: 24
  }
});

export default DateRangeInputs;
