import React from "react";

import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import Colors from "../../themes/Colors";
import { FontSize } from "../../themes/Fonts";
import CalendarPickerRangeReusable from "./CalendarPickerRangeReusable";
import useHumanCalendar from "./hooks/useHumanCalendar";

/**
 * Componente de ejemplo que demuestra el uso del CalendarReusable
 * Este componente muestra diferentes configuraciones del calendario usando el nuevo
 * componente reutilizable CalendarPickerRangeReusable
 */
const CalendarReusableExample = () => {
  const today = new Date();
  const oneWeekForward = new Date(Date.now() + 24 * 60 * 60 * 1000 * 7);
  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const twoWeeksForward = new Date(Date.now() + 24 * 60 * 60 * 1000 * 14);

  // Ejemplo básico del calendario (con fechas por defecto del hook)
  const calendar = useHumanCalendar({
    // initialStartDate: oneMonthAgo,
    // initialEndDate: today
  });

  // Ejemplo de calendario con una fecha y rango personalizado (últimos 6 meses)
  const singleDateCalendar = useHumanCalendar({
    canBeSameDay: true,
    minDate: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1), // 6 meses atras
    maxDate: new Date() // hoy
    // initialStartDate: today,
    // initialEndDate: today
  });

  // Ejemplo de calendario con rango de fechas, inputs y rango futuro (próximos 3 meses)
  const fullFeaturedCalendar = useHumanCalendar({
    enableDateRangeInputs: true,
    canBeSameDay: true,
    minDate: new Date(), // hoy
    maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0), // 3 meses adelante
    initialStartDate: today,
    initialEndDate: twoWeeksForward
  });

  const renderCalendarExample = (title, calendarHook, description, customProps = {}) => (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>{title}</Text>
      <Text style={styles.exampleDescription}>{description}</Text>

      {/* Usando el nuevo componente reutilizable */}
      <CalendarPickerRangeReusable
        calendarHook={calendarHook}
        title="Fechas seleccionadas"
        placeholder="Seleccione un rango de fechas"
        testID={`calendar-example-${title.toLowerCase().replace(/\s+/g, "-")}`}
        {...customProps}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>Ejemplo de CalendarReusable</Text>

      {renderCalendarExample(
        "Calendario Original (Mes pasado - Hoy)",
        calendar,
        "Fechas iniciales: desde hace 1 mes hasta hoy y Limites: 1 año atras hasta hoy"
      )}

      {renderCalendarExample("Calendario Una Fecha (Hoy)", singleDateCalendar, "Fecha inicial: solo hoy seleccionado y Limites: 6 meses atras hasta hoy", {
        showTitle: true
        // customStyles: {
        //   button: { borderColor: Colors.primary[300] },
        //   text: { color: Colors.primary[300] }
        // }
      })}

      {renderCalendarExample(
        "Calendario Rango Futuro (Hoy - 2 semanas)",
        fullFeaturedCalendar,
        "Fechas iniciales: desde hoy hasta 2 semanas adelante y Limites: hoy hasta 3 meses adelante"
        // {
        //   modalAnimationType: "slide",
        //   dateSeparator: " al ",
        //   placeholder: "Toque para seleccionar período futuro",
        //   customStyles: {
        //     container: { marginVertical: 8 },
        //     button: {
        //       backgroundColor: "#F8F9FA",
        //       borderColor: "#28A745",
        //       borderWidth: 2
        //     },
        //     text: {
        //       color: "#28A745",
        //       fontWeight: "600"
        //     }
        //   }
        // }
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  mainTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
    marginBottom: 8
  },
  exampleContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#FFF",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  exampleTitle: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    color: Colors.primary[300],
    marginBottom: 8
  },
  exampleDescription: {
    fontSize: FontSize.small,
    color: Colors.neutral[500],
    marginBottom: 16,
    lineHeight: 20
  }
});

export default CalendarReusableExample;
