import React, { useCallback, useMemo, useState } from "react";

// Assets
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import IconSearch from "../../assets/icons/feather-search-black.svg";
import IconXClose from "../../assets/icons/x-close.svg";

import AlertRedSVG from "../../assets/icons/alert-circle-red.svg";
import ChevronDownSVG from "../../assets/icons/chevron-down-mascota.svg";
// Utils & Constants
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";
import { countryFlagEmojis } from "./helpers/CountryHelper";

// Constants
const CONSTANTS = {
  ITEM_HEIGHT: 50,
  HEADER_HEIGHT: 60,
  SEARCH_HEIGHT: 55,
  MIN_ITEMS: 6,
  MAX_ITEMS_FOR_DYNAMIC_HEIGHT: 20,
  ICON_SIZE: 22,
  ICON_COLOR: "#B3B9C6",
  LOADING_COLOR: "#4A9ED4",
  MAX_HEIGHT_PERCENT: "75%",
  DEFAULT_PLACEHOLDER: "Selecciona una opción",
  DEFAULT_SEARCH_PLACEHOLDER: "Buscar...",
  LABEL_KEY: "label",
  VALUE_KEY: "value"
};

/**
 * Componente de lista desplegable reutilizable con búsqueda, estados de error, deshabilitado, cargando y personalización.
 * Incluye un contador de elementos y botón de cierre en el modal.
 *
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.label - Etiqueta que se muestra sobre el campo
 * @param {Array} props.data - Array de objetos con los datos para la lista
 * @param {string|number} props.valueSelected - Valor seleccionado
 * @param {string} [props.placeholder] - Texto que se muestra cuando no hay valor seleccionado
 * @param {string} [props.searchPlaceholder] - Texto del placeholder para el campo de búsqueda
 * @param {Function} props.onChange - Función que se ejecuta al seleccionar un item
 * @param {boolean} [props.disabled=false] - Indica si el campo está deshabilitado
 * @param {boolean} [props.loading=false] - Indica si el campo está en estado de carga
 * @param {string} [props.colorLoading="#94A3B8"] - Color del ActivityIndicator cuando loading es true
 * @param {string} [props.errorMessage] - Mensaje de error a mostrar
 * @param {Object} [props.customStyles] - Estilos personalizados para los componentes
 * @param {Object} [props.customStyles.container] - Estilos para el contenedor principal
 * @param {Object} [props.customStyles.emptyContainer] - Estilos para el contenedor cuando no hay resultados
 * @param {Object} [props.customStyles.emptyText] - Estilos para el texto cuando no hay resultados
 * @param {Object} [props.customStyles.labelContainer] - Estilos para el contenedor de la etiqueta
 * @param {Object} [props.customStyles.labelStyle] - Estilos para la etiqueta
 * @param {Object} [props.customStyles.input] - Estilos para el input
 * @param {Object} [props.customStyles.valueSelected] - Estilos para el valor seleccionado
 * @param {Object} [props.customStyles.placeholder] - Estilos para el placeholder
 * @param {Object} [props.customStyles.errorInput] - Estilos para el input en estado de error
 * @param {Object} [props.customStyles.errorLabel] - Estilos para la etiqueta en estado de error
 * @param {Object} [props.customStyles.errorText] - Estilos para el texto en estado de error
 * @param {Object} [props.customStyles.errorMessageStyle] - Estilos para el mensaje de error
 * @param {Object} [props.customStyles.disabledInput] - Estilos para el input deshabilitado
 * @param {Object} [props.customStyles.disabledText] - Estilos para el texto deshabilitado
 * @param {Object} [props.customStyles.iconCustom] - Estilos para el ícono personalizado
 * @param {Object} [props.customStyles.modalOverlay] - Estilos para el overlay del modal
 * @param {Object} [props.customStyles.modalContainer] - Estilos para el contenedor del modal
 * @param {Object} [props.customStyles.modalHeader] - Estilos para el header del modal
 * @param {Object} [props.customStyles.closeButton] - Estilos para el botón de cierre
 * @param {Object} [props.customStyles.closeButtonText] - Estilos para el texto del botón de cierre
 * @param {Object} [props.customStyles.closeButtonCircle] - Estilos para el círculo del botón de cierre
 * @param {Object} [props.customStyles.closeButtonIcon] - Estilos para el icono del botón de cierre
 * @param {Object} [props.customStyles.itemCount] - Estilos para el contador de items
 * @param {Object} [props.customStyles.searchContainer] - Estilos para el contenedor de búsqueda
 * @param {Object} [props.customStyles.searchInput] - Estilos para el input de búsqueda
 * @param {Object} [props.customStyles.searchIcon] - Estilos para el icono de búsqueda
 * @param {Object} [props.customStyles.listContent] - Estilos para el contenido de la lista
 * @param {Object} [props.customStyles.item] - Estilos para cada item de la lista
 * @param {Object} [props.customStyles.itemText] - Estilos para el texto de cada item
 * @param {Object} [props.customStyles.selectedItem] - Estilos para el ítem seleccionado en la lista
 * @param {Object} [props.customStyles.selectedItemText] - Estilos para el texto del ítem seleccionado en la lista
 * @param {string} [props.labelKey='label'] - Key para mostrar el texto en cada item
 * @param {string} [props.valueKey='value'] - Key para el valor de cada item
 * @param {React.Element} [props.iconCustom] - Componente de ícono personalizado
 * @param {number} [props.iconSize] - Tamaño del ícono
 * @param {string} [props.iconColor='#B3B9C6'] - Color del ícono
 * @param {boolean} [props.required=false] - Indica si el campo es requerido
 * @param {boolean} [props.showRequired=true] - Controla la visibilidad del indicador de campo requerido
 * @param {number} [props.maxLength] - Longitud máxima del texto mostrado para el valor seleccionado
 * @param {boolean} [props.isCountryList=false] - Indica si el listado es de países
 */

const DropDownListReusable = ({
  label,
  data = [],
  valueSelected = null,
  placeholder = CONSTANTS.DEFAULT_PLACEHOLDER,
  searchPlaceholder = CONSTANTS.DEFAULT_SEARCH_PLACEHOLDER,
  onChange,
  disabled = false,
  loading = false,
  colorLoading = CONSTANTS.LOADING_COLOR,
  errorMessage,
  customStyles = {},
  labelKey = CONSTANTS.LABEL_KEY,
  valueKey = CONSTANTS.VALUE_KEY,
  iconCustom = null,
  iconSize = CONSTANTS.ICON_SIZE,
  iconColor = CONSTANTS.ICON_COLOR,
  required = false,
  showRequired = true,
  maxLength = null,
  isCountryList = false
}) => {
  // Estados del componente
  const [isVisible, setIsVisible] = useState(false); // Controla visibilidad del modal
  const [searchText, setSearchText] = useState(""); // Texto de búsqueda

  // Valores memoizados para optimización
  // Item seleccionado
  const selectedItem = useMemo(() => data?.find((item) => item[valueKey] === valueSelected), [data, valueKey, valueSelected]);

  // Valor a mostrar con truncamiento
  const displayValue = useMemo(() => {
    if (!selectedItem) return "";

    const text = selectedItem[labelKey];

    // Validar que text sea una string válida
    if (!text || typeof text !== "string") return "";

    return maxLength && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }, [selectedItem, labelKey, maxLength]);

  // Mostrar asterisco si es requerido
  const shouldShowAsterisk = useMemo(() => required && showRequired && !selectedItem, [required, showRequired, selectedItem]);

  // Datos filtrados por búsqueda
  const filteredData = useMemo(() => {
    if (!data?.length) return [];

    if (!searchText) return data;

    return data.filter((item) => item[labelKey]?.toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText, labelKey]);

  // Mostrar búsqueda si hay muchos items
  const shouldShowSearch = useMemo(() => data?.length > 20, [data]);

  // Manejadores de eventos
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsVisible(true);
      setSearchText(""); // Abrir modal y limpiar búsqueda
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchText(""); // Cerrar modal y limpiar búsqueda
  }, []);

  const handleSelect = useCallback(
    (item) => {
      const newValue = item[valueKey] === valueSelected ? null : item[valueKey]; // Toggle selección

      onChange(newValue);
      handleClose();
    },
    [onChange, valueKey, valueSelected, handleClose]
  );

  // Función para calcular altura dinámica del modal
  const getModalHeight = (shouldShowSearch, searchText, filteredDataLength) => {
    // Altura fija para búsqueda activa o muchos elementos
    if (searchText?.length > 0 || filteredDataLength > CONSTANTS.MAX_ITEMS_FOR_DYNAMIC_HEIGHT) {
      return CONSTANTS.MAX_HEIGHT_PERCENT;
    }

    // Ajustes específicos por rango de elementos
    if (filteredDataLength >= 7 && filteredDataLength < 10) {
      return "45%";
    }

    if (filteredDataLength > 7 && filteredDataLength <= 10) {
      return IS_IOS ? "58%" : "55%";
    }

    if (filteredDataLength > 10 && filteredDataLength <= 15) {
      return IS_IOS ? "60%" : "58%";
    }

    // Cálculo dinámico basado en número de elementos
    const visibleItems = filteredDataLength < CONSTANTS.MIN_ITEMS ? Math.max(filteredDataLength, 2.5) : Math.max(filteredDataLength, CONSTANTS.MIN_ITEMS);
    const calculatedHeight = CONSTANTS.HEADER_HEIGHT + (shouldShowSearch ? CONSTANTS.SEARCH_HEIGHT : 0) + visibleItems * CONSTANTS.ITEM_HEIGHT;

    // Agregar padding adicional y límite máximo
    const heightWithPadding = calculatedHeight + 18; // 18px de padding extra
    const maxCalculatedHeight = "75%"; // Máximo altura calculada antes de usar 80%

    // Si la altura calculada es muy grande, usar porcentaje
    if (heightWithPadding > 600) {
      return maxCalculatedHeight;
    }

    return heightWithPadding;
  };

  // Valores calculados
  const modalHeight = getModalHeight(shouldShowSearch, searchText, filteredData.length); // Altura del modal

  const icon = useMemo(() => {
    if (errorMessage) {
      return <AlertRedSVG width={iconSize} height={iconSize} style={[styles.iconCustom, customStyles.iconCustom]} />; // Icono de error
    }

    return iconCustom || <ChevronDownSVG width={iconSize} height={iconSize} color={iconColor} style={[styles.iconCustom, customStyles.iconCustom]} />; // Icono por defecto
  }, [errorMessage, iconCustom, iconSize, iconColor, customStyles]);

  // Funciones de renderizado
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item[valueKey] === valueSelected; // Verificar si está seleccionado
      const countryFlag = isCountryList && item.isocode ? `${countryFlagEmojis[item.isocode] || countryFlagEmojis.DEFAULT || ""}     ` : ""; // Bandera del país si aplica

      // Validar que el texto del item sea válido
      const itemText = item[labelKey] && typeof item[labelKey] === "string" ? item[labelKey] : "";

      return (
        <TouchableOpacity
          style={[styles.item, customStyles.item, isSelected && [styles.selectedItem, customStyles.selectedItem]]}
          onPress={() => handleSelect(item)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Seleccionar ${itemText}`}
          accessibilityHint="Selecciona una opción de la lista">
          <Text style={[styles.itemText, customStyles.itemText, isSelected && [styles.selectedItemText, customStyles.selectedItemText]]}>
            {countryFlag}
            {itemText}
          </Text>
        </TouchableOpacity>
      );
    },
    [labelKey, valueKey, valueSelected, handleSelect, customStyles, isCountryList]
  );

  // Componente para lista vacía
  const ListEmptyComponent = useCallback(
    () => (
      <View style={[styles.emptyContainer, customStyles.emptyContainer]}>
        <Text style={[styles.emptyText, customStyles.emptyText]}>No se encontraron resultados</Text>
      </View>
    ),
    [customStyles]
  );

  // Renderizar contenido del input
  const renderInputContent = () => {
    const countryFlag =
      isCountryList && selectedItem && selectedItem.isocode ? `${countryFlagEmojis[selectedItem.isocode] || countryFlagEmojis.DEFAULT || ""}   ` : ""; // Bandera del país seleccionado

    return (
      <>
        <Text
          style={[
            styles.valueSelectedStyle,
            !displayValue && [styles.placeholder, customStyles.placeholder],
            customStyles.valueSelected,
            errorMessage && [styles.errorText, customStyles.errorText],
            (disabled || loading) && [styles.disabledText, customStyles.disabledText]
          ]}>
          {countryFlag}
          {displayValue || placeholder}
        </Text>
        {icon}
      </>
    );
  };

  // Renderizar modal
  const renderModal = () => {
    if (loading) return null; // No mostrar modal si está cargando

    return (
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleClose} statusBarTranslucent={true}>
        <View style={[styles.modalOverlay, customStyles.modalOverlay]} onTouchEnd={(e) => e.stopPropagation()}>
          <View style={[styles.modalContainer, customStyles.modalContainer]}>
            <View style={[styles.modalContent, customStyles.modalContent, { height: modalHeight }]}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={0}>
                <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
                  {/* Header del modal */}
                  <View style={[styles.modalHeader, customStyles.modalHeader]}>
                    <TouchableOpacity style={[styles.closeButton, customStyles.closeButton]} onPress={handleClose}>
                      <View style={[styles.closeButtonCircle, customStyles.closeButtonCircle]}>
                        <IconXClose width={18} height={20} style={[styles.closeButtonIcon, customStyles.closeButtonIcon]} />
                      </View>
                    </TouchableOpacity>
                    <Text style={[styles.itemCount, customStyles.itemCount]}>
                      {filteredData?.length} {filteredData?.length === 1 ? "elemento" : "elementos"} {/* Contador de elementos */}
                    </Text>
                  </View>

                  {/* Campo de búsqueda */}
                  {shouldShowSearch && (
                    <View style={[styles.searchContainer, customStyles.searchContainer]}>
                      <View style={[styles.searchInputContainer, customStyles.searchInputContainer]}>
                        <IconSearch width={18} height={18} style={[styles.searchIcon, customStyles.searchIcon]} />
                        <TextInput
                          style={[styles.searchInput, customStyles.searchInput]}
                          placeholder={searchPlaceholder}
                          value={searchText}
                          onChangeText={setSearchText}
                        />
                        {searchText.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
                            <IconXClose width={16} height={16} style={styles.clearButtonIcon} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Lista de elementos */}
                  <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item[valueKey]?.toString() || ""}${index}`}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={[styles.listContent, customStyles.listContent]}
                    ListEmptyComponent={ListEmptyComponent}
                    keyboardShouldPersistTaps="handled"
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    scrollEnabled={true}
                    style={{ flex: 1 }}
                  />
                </SafeAreaView>
              </KeyboardAvoidingView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, customStyles.container]}>
      {/* Etiqueta */}
      <View style={[styles.labelContainer, customStyles.labelContainer]}>
        <Text style={[styles.labelStyle, customStyles.labelStyle, errorMessage && [styles.errorLabel, customStyles.errorLabel]]}>
          {label}
          {shouldShowAsterisk && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      </View>

      {/* Campo seleccionable */}
      <TouchableOpacity
        style={[
          styles.input,
          customStyles.input,
          errorMessage && [styles.errorInput, customStyles.errorInput],
          (disabled || loading) && [styles.disabledInput, customStyles.disabledInput]
        ]}
        onPress={handleOpen}
        disabled={disabled || loading}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${label}`}
        accessibilityHint="Abre una lista de opciones">
        {loading ? (
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={iconSize} color={colorLoading} style={[styles.iconCustom, customStyles.iconCustom]} />
          </View>
        ) : (
          renderInputContent()
        )}
      </TouchableOpacity>

      {/* Mensaje de error */}
      {errorMessage && <Text style={[styles.errorMessageStyle, customStyles.errorMessageStyle]}>{errorMessage}</Text>}

      {/* Modal */}
      {renderModal()}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  labelStyle: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 16.5 : 16.5,
    fontWeight: IS_IOS ? "500" : "600",
    color: Colors.textPrimary
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF"
  },
  valueSelectedStyle: {
    flex: 1,
    fontSize: 15,
    color: "#0F1929"
  },
  placeholder: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  // Estilos para el ítem seleccionado en la lista
  selectedItem: {
    // backgroundColor: "#f0f9f0",
    // borderRadius: 6

    backgroundColor: "#D9EEFF",
    borderColor: "#D9EEFF",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4
  },
  selectedItemText: {
    fontWeight: "500"
  },
  errorInput: {
    borderColor: "#FAAAA4",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorLabel: {
    color: "#F04438",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorText: {
    color: "#6B758C",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  errorMessageStyle: {
    color: "#F04438",
    fontSize: IS_IOS ? 14.5 : 14,
    marginTop: 4,
    textAlign: "left",
    paddingHorizontal: 6,
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  disabledInput: {
    backgroundColor: "#F5F6F8",
    borderColor: "#E1E4E8"
  },
  disabledText: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  requiredAsterisk: {
    color: "#FF4D4F"
  },
  iconCustom: {
    marginLeft: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    width: IS_IOS ? "92%" : "99%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden"
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  closeButton: {
    position: "absolute",
    right: 16,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F6F8", // Mismo color que el fondo del input
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonIcon: {
    color: "#464C5E"
  },
  itemCount: {
    fontSize: IS_IOS ? 16 : 15,
    color: "#6B758C"
  },
  searchContainer: {
    paddingTop: 10,
    paddingHorizontal: 8
  },
  searchInputContainer: {
    borderWidth: 1,
    borderColor: "#B3B9C5",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: IS_IOS ? 16 : 14,
    color: "#464C5E",
    padding: 0
  },
  listContent: {
    padding: 8
  },
  item: {
    padding: 10,
    borderBottomColor: "#F0F0F0"
  },
  itemText: {
    fontSize: IS_IOS ? 15 : 14,
    color: "#464C5E"
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyText: {
    fontSize: IS_IOS ? 16 : 14,
    color: "#B3B9C6",
    textAlign: "center"
  },
  countryFlag: {
    fontSize: 20,
    paddingRight: 10
  },
  clearButton: {
    padding: 4,
    marginLeft: 8
  },
  clearButtonIcon: {
    color: "#464C5E"
  }
});

export default DropDownListReusable;
