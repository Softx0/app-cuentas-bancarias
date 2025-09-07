/**
 * Custom DateTimePicker to replace react-native-modal-datetime-picker
 * Uses only React Native native components
 */
import React, { useMemo, useState } from "react";

import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";

/**
 * Custom DateTimePicker component using only native React Native components
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} [props.isVisible=false] - Whether the picker is visible
 * @param {string} [props.mode="date"] - Picker mode (only "date" supported)
 * @param {function} props.onConfirm - Callback when date is confirmed
 * @param {function} props.onCancel - Callback when picker is cancelled
 * @param {Date} [props.date] - Initial date
 * @param {Date} [props.minimumDate] - Minimum selectable date
 * @param {Date} [props.maximumDate] - Maximum selectable date
 * @param {string} [props.confirmTextIOS="Aceptar"] - Confirm button text
 * @param {string} [props.cancelTextIOS="Cancelar"] - Cancel button text  
 * @param {string} [props.titleIOS="Seleccionar fecha"] - Modal title
 * @param {string} [props.locale="es-ES"] - Locale (not used in this implementation)
 * @param {string} [props.display="spinner"] - Display type (not used in this implementation)
 * @returns {React.ReactElement} DateTimePicker component
 */
const DateTimePickerReusable = ({
  isVisible = false,
  mode = "date",
  onConfirm,
  onCancel,
  date,
  minimumDate,
  maximumDate,
  confirmTextIOS = "Aceptar",
  cancelTextIOS = "Cancelar",
  titleIOS = "Seleccionar fecha",
  locale = "es-ES",
  display = "spinner"
}) => {
  const [selectedDate, setSelectedDate] = useState(date || new Date());

  // Generate year options
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const minYear = minimumDate ? minimumDate.getFullYear() : currentYear - 10;
    const maxYear = maximumDate ? maximumDate.getFullYear() : currentYear + 10;
    
    const years = [];
    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }
    return years;
  }, [minimumDate, maximumDate]);

  // Generate month options
  const monthOptions = useMemo(() => [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ], []);

  // Generate day options
  const dayOptions = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  const handleConfirm = () => {
    console.log("DateTimePickerReusable confirmed:", JSON.stringify({ selectedDate }, null, 2));
    onConfirm && onConfirm(selectedDate);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const updateDate = (year, month, day) => {
    const newDate = new Date(year, month, day);
    
    // Check date boundaries
    if (minimumDate && newDate < minimumDate) return;
    if (maximumDate && newDate > maximumDate) return;
    
    setSelectedDate(newDate);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{titleIOS}</Text>
          </View>

          {/* Date Display */}
          <View style={styles.dateDisplay}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          {/* Simple Date Selector */}
          <View style={styles.selectorContainer}>
            {/* Day Selector */}
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Día</Text>
              <View style={styles.selector}>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const newDay = selectedDate.getDate() - 1;
                    if (newDay >= 1) {
                      updateDate(selectedDate.getFullYear(), selectedDate.getMonth(), newDay);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.selectorValue}>{selectedDate.getDate()}</Text>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const maxDay = dayOptions.length;
                    const newDay = selectedDate.getDate() + 1;
                    if (newDay <= maxDay) {
                      updateDate(selectedDate.getFullYear(), selectedDate.getMonth(), newDay);
                    }
                  }}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Month Selector */}
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Mes</Text>
              <View style={styles.selector}>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const newMonth = selectedDate.getMonth() - 1;
                    if (newMonth >= 0) {
                      updateDate(selectedDate.getFullYear(), newMonth, selectedDate.getDate());
                    }
                  }}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.selectorValue}>{monthOptions[selectedDate.getMonth()]}</Text>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const newMonth = selectedDate.getMonth() + 1;
                    if (newMonth <= 11) {
                      updateDate(selectedDate.getFullYear(), newMonth, selectedDate.getDate());
                    }
                  }}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Year Selector */}
            <View style={styles.selectorColumn}>
              <Text style={styles.selectorLabel}>Año</Text>
              <View style={styles.selector}>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const newYear = selectedDate.getFullYear() - 1;
                    if (yearOptions.includes(newYear)) {
                      updateDate(newYear, selectedDate.getMonth(), selectedDate.getDate());
                    }
                  }}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.selectorValue}>{selectedDate.getFullYear()}</Text>
                <TouchableOpacity 
                  style={styles.selectorButton}
                  onPress={() => {
                    const newYear = selectedDate.getFullYear() + 1;
                    if (yearOptions.includes(newYear)) {
                      updateDate(newYear, selectedDate.getMonth(), selectedDate.getDate());
                    }
                  }}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelTextIOS}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={[styles.buttonText, styles.confirmButtonText]}>{confirmTextIOS}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: 400
  },
  header: {
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: IS_IOS ? 18 : 18,
    fontWeight: "600",
    color: Colors.textPrimary || "#333",
    fontFamily: "SF Pro"
  },
  dateDisplay: {
    backgroundColor: Colors.primary || "#007AFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center"
  },
  dateText: {
    color: "white",
    fontSize: IS_IOS ? 16 : 16,
    fontWeight: "500",
    fontFamily: "SF Pro",
    textAlign: "center"
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  selectorColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5
  },
  selectorLabel: {
    fontSize: IS_IOS ? 14 : 14,
    fontWeight: "500",
    color: Colors.textSecondary || "#666",
    fontFamily: "SF Pro",
    marginBottom: 10
  },
  selector: {
    alignItems: "center"
  },
  selectorButton: {
    backgroundColor: Colors.primary || "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5
  },
  selectorValue: {
    fontSize: IS_IOS ? 16 : 16,
    fontWeight: "600",
    color: Colors.textPrimary || "#333",
    fontFamily: "SF Pro",
    textAlign: "center",
    minHeight: 24,
    minWidth: 80
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: Colors.neutral?.[300] || "#E5E5E5"
  },
  confirmButton: {
    backgroundColor: Colors.primary || "#007AFF"
  },
  buttonText: {
    fontSize: IS_IOS ? 16 : 16,
    fontWeight: "500",
    fontFamily: "SF Pro",
    color: "white"
  },
  cancelButtonText: {
    color: Colors.textPrimary || "#333"
  },
  confirmButtonText: {
    color: "white"
  }
});

export default DateTimePickerReusable;
