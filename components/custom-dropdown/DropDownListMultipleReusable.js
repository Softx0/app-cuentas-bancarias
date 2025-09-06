// Importaciones necesarias para el componente
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Iconos SVG utilizados en el componente
import IconSearch from "../../assets/icons/feather-search-black.svg";
import IconXClose from "../../assets/icons/x-close.svg";
// Componentes nativos de React Native
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Iconos adicionales para estados de error y dropdown
import AlertRedSVG from "../../assets/icons/alert-circle-red.svg";
import ChevronDownSVG from "../../assets/icons/chevron-down-mascota.svg";
// Temas y utilidades del proyecto
import Colors from "../../themes/Colors";
import { IS_IOS } from "../../utils/StyleHelpers";
import CheckBoxReusable from "../custom-checkbox/CheckBoxReusable";

// Constantes de configuración del componente
const CONSTANTS = {
  ITEM_HEIGHT: 50,
  HEADER_HEIGHT: 60,
  SEARCH_HEIGHT: 55,
  MIN_ITEMS: 6,
  SEARCH_THRESHOLD: 20,
  MAX_ITEMS_FOR_DYNAMIC_HEIGHT: 20,
  MAX_CHARS_DISPLAY: 20,
  ICON_SIZE: 22,
  ICON_COLOR: "#B3B9C6",
  LOADING_COLOR: "#4A9ED4",
  MAX_HEIGHT_PERCENT: "75%",
  DEFAULT_PLACEHOLDER: "",
  DEFAULT_SEARCH_PLACEHOLDER: "Buscar...",
  DEFAULT_CONFIRM_TEXT: "Confirmar selección",
  LABEL_KEY: "label",
  VALUE_KEY: "value",
  DEFAULT_LIST_ITEMS_DISPLAY: 5
};

/**
 * Dropdown reutilizable para selección múltiple con búsqueda
 * Permite seleccionar múltiples elementos de una lista con funcionalidad de búsqueda
 *
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {Array} props.data - Array de datos para mostrar en la lista
 * @param {Array} props.valuesSelected - Array de valores seleccionados
 * @param {string} [props.placeholder=""] - Texto placeholder cuando no hay selección
 * @param {string} [props.searchPlaceholder="Buscar..."] - Placeholder del buscador
 * @param {Function} props.onChange - Función callback cuando cambia la selección
 * @param {boolean} [props.disabled=false] - Si el componente está deshabilitado
 * @param {boolean} [props.loading=false] - Si está en estado de carga
 * @param {string} [props.colorLoading="#4A9ED4"] - Color del indicador de carga
 * @param {string} [props.errorMessage] - Mensaje de error a mostrar
 * @param {Object} [props.customStyles={}] - Estilos personalizados
 * @param {string} [props.labelKey="label"] - Clave para obtener el texto a mostrar
 * @param {string} [props.valueKey="value"] - Clave para obtener el valor del elemento
 * @param {React.Element} [props.iconCustom=null] - Icono personalizado
 * @param {number} [props.iconSize=22] - Tamaño del icono
 * @param {string} [props.iconColor="#B3B9C6"] - Color del icono
 * @param {boolean} [props.required=false] - Si el campo es requerido
 * @param {boolean} [props.showRequired=true] - Si mostrar el asterisco de requerido
 * @param {string} [props.confirmButtonText="Confirmar selección"] - Texto del botón de confirmación
 * @param {number} [props.maxLength=null] - Longitud máxima (no usado actualmente)
 * @param {number} [props.listItemsSelectedDisplay=5] - Número máximo de elementos a mostrar en detalle
 */

// Funciones utilitarias

/**
 * Trunca el texto si excede la longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} - Texto truncado con "..." si es necesario
 */
const truncateText = (text, maxLength = CONSTANTS.MAX_CHARS_DISPLAY) => {
  if (!text) return "";

  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
};

/**
 * Calcula la altura del modal basada en el contenido
 * @param {boolean} shouldShowSearch - Si debe mostrar el buscador
 * @param {string} searchText - Texto de búsqueda actual
 * @param {number} filteredDataLength - Cantidad de elementos filtrados
 * @returns {string|number} - Altura del modal
 */

const getModalHeight = (shouldShowSearch, searchText, filteredDataLength) => {
  // Si hay búsqueda activa o demasiados elementos, usar altura fija
  if (searchText?.length > 0 || filteredDataLength > CONSTANTS.MAX_ITEMS_FOR_DYNAMIC_HEIGHT) {
    return CONSTANTS.MAX_HEIGHT_PERCENT;
  }

  // Calcular altura basada en número de elementos visibles
  // Para pocos elementos, usar el número real en lugar del mínimo
  const visibleItems = filteredDataLength < CONSTANTS.MIN_ITEMS ? Math.max(filteredDataLength, 3) : Math.max(filteredDataLength, CONSTANTS.MIN_ITEMS);
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

// const getModalHeight = (shouldShowSearch, searchText, filteredDataLength) => {
//   // Si hay búsqueda activa o demasiados elementos, usar altura fija
//   if (searchText?.length > 0 || filteredDataLength > CONSTANTS.MAX_ITEMS_FOR_DYNAMIC_HEIGHT) {
//     return CONSTANTS.MAX_HEIGHT_PERCENT;
//   }

//   // Calcular altura basada en número de elementos visibles
//   // Para pocos elementos, usar el número real en lugar del mínimo
//   const visibleItems = filteredDataLength < CONSTANTS.MIN_ITEMS ? Math.max(filteredDataLength, 3) : Math.max(filteredDataLength, CONSTANTS.MIN_ITEMS);
//   const calculatedHeight = CONSTANTS.HEADER_HEIGHT + (shouldShowSearch ? CONSTANTS.SEARCH_HEIGHT : 0) + visibleItems * CONSTANTS.ITEM_HEIGHT;

//   // Agregar padding adicional y límite máximo
//   const heightWithPadding = calculatedHeight + 18; // 18px de padding extra
//   const maxCalculatedHeight = "65%"; // Máximo altura calculada antes de usar 80%

//   // Si la altura calculada es muy grande, usar porcentaje
//   if (heightWithPadding > 600) {
//     return maxCalculatedHeight;
//   }

//   return heightWithPadding;
// };

// Subcomponentes

/**
 * Tarjeta que muestra un elemento seleccionado con botón para eliminarlo
 */
const SelectedItemCard = React.memo(({ item, onRemove, labelKey, valueKey, customStyles = {} }) => (
  <View style={[styles.selectedItemCard, customStyles.selectedItemCard]}>
    {/* Botón para remover el elemento seleccionado */}
    <TouchableOpacity
      style={[styles.removeItemButton, customStyles.selectedItemCardIconContainer]}
      onPress={() => onRemove(item[valueKey])}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Quitar ${item[labelKey]}`}>
      <IconXClose width={12} height={12} style={[styles.removeItemButtonIcon, customStyles.selectedItemCardIcon]} />
    </TouchableOpacity>
    {/* Texto del elemento seleccionado */}
    <Text style={[styles.selectedItemCardText, customStyles.selectedItemCardText]} numberOfLines={1}>
      {truncateText(item[labelKey])}
    </Text>
  </View>
));

/**
 * Componente que se muestra cuando no hay resultados en la búsqueda
 */
const ListEmptyComponent = React.memo(({ customStyles = {} }) => (
  <View style={[styles.emptyContainer, customStyles.emptyContainer]}>
    <Text style={[styles.emptyText, customStyles.emptyText]}>No se encontraron resultados</Text>
  </View>
));

/**
 * Input de búsqueda con icono
 */
const SearchInput = React.memo(({ searchText, setSearchText, searchPlaceholder, customStyles = {} }) => (
  <View style={[styles.searchInputContainer, customStyles.searchInputContainer]}>
    {/* Icono de búsqueda */}
    <IconSearch width={18} height={18} style={[styles.searchIcon, customStyles.searchIcon]} />
    {/* Campo de texto para buscar */}
    <TextInput style={[styles.searchInput, customStyles.searchInput]} placeholder={searchPlaceholder} value={searchText} onChangeText={setSearchText} />
    {/* Botón para limpiar búsqueda */}
    {searchText.length > 0 && (
      <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
        <IconXClose width={16} height={16} style={styles.clearButtonIcon} />
      </TouchableOpacity>
    )}
  </View>
));

/**
 * Header del modal con contador de elementos y botón de cerrar
 */
const ModalHeader = React.memo(({ filteredDataLength, onClose, customStyles = {} }) => (
  <View style={[styles.modalHeader, customStyles.modalHeader]}>
    {/* Contador de elementos */}
    <Text style={[styles.itemCount, customStyles.itemCount]}>
      {filteredDataLength} {filteredDataLength === 1 ? "elemento" : "elementos"}
    </Text>
    {/* Botón para cerrar el modal */}
    <TouchableOpacity style={[styles.closeButton, customStyles.closeButton]} onPress={onClose}>
      <View style={[styles.closeButtonCircle, customStyles.closeButtonCircle]}>
        <IconXClose width={18} height={20} style={[styles.closeButtonIcon, customStyles.closeButtonIcon]} />
      </View>
    </TouchableOpacity>
  </View>
));

// Componente Principal

const DropDownListMultipleReusable = ({
  label, // Etiqueta del campo
  data = [], // Array de datos para mostrar en la lista
  valuesSelected = [], // Array de valores seleccionados
  placeholder = CONSTANTS.DEFAULT_PLACEHOLDER, // Texto placeholder cuando no hay selección
  searchPlaceholder = CONSTANTS.DEFAULT_SEARCH_PLACEHOLDER, // Placeholder del buscador
  onChange, // Función callback cuando cambia la selección
  disabled = false, // Si el componente está deshabilitado
  loading = false, // Si está en estado de carga
  colorLoading = CONSTANTS.LOADING_COLOR, // Color del indicador de carga
  errorMessage, // Mensaje de error a mostrar
  customStyles = {}, // Estilos personalizados
  labelKey = CONSTANTS.LABEL_KEY, // Clave para obtener el texto a mostrar
  valueKey = CONSTANTS.VALUE_KEY, // Clave para obtener el valor del elemento
  iconCustom = null, // Icono personalizado
  iconSize = CONSTANTS.ICON_SIZE, // Tamaño del icono
  iconColor = CONSTANTS.ICON_COLOR, // Color del icono
  required = false, // Si el campo es requerido
  showRequired = true, // Si mostrar el asterisco de requerido
  confirmButtonText = CONSTANTS.DEFAULT_CONFIRM_TEXT, // Texto del botón de confirmación
  maxLength = null, // Longitud máxima (no usado actualmente)
  listItemsSelectedDisplay = CONSTANTS.DEFAULT_LIST_ITEMS_DISPLAY // Número máximo de elementos a mostrar en detalle
}) => {
  // Estados del componente
  const [isVisible, setIsVisible] = useState(false); // Controla si el modal está visible
  const [searchText, setSearchText] = useState(""); // Texto de búsqueda actual
  const [tempSelectedValues, setTempSelectedValues] = useState([]); // Valores seleccionados temporalmente (antes de confirmar)

  // Valores memoizados para optimización de rendimiento

  // Asegura que data sea siempre un array válido
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Asegura que valuesSelected sea siempre un array válido
  const safeValuesSelected = useMemo(() => (Array.isArray(valuesSelected) ? valuesSelected : []), [valuesSelected]);

  // Obtiene los elementos completos que están seleccionados
  const selectedItems = useMemo(() => {
    if (!safeData.length || !safeValuesSelected.length) return [];

    return safeData.filter((item) => safeValuesSelected.includes(item[valueKey]));
  }, [safeData, valueKey, safeValuesSelected]);

  // Genera el texto a mostrar en el input principal
  const displayValue = useMemo(() => {
    if (!selectedItems?.length) return "";
    const count = selectedItems.length;

    return `${count} ${count === 1 ? "elemento seleccionado" : "elementos seleccionados"}`;
  }, [selectedItems]);

  // Contador de elementos seleccionados temporalmente
  const selectedCountText = useMemo(() => tempSelectedValues.length.toString(), [tempSelectedValues.length]);

  // Determina si mostrar la lista detallada de elementos seleccionados
  const shouldShowDetailedList = useMemo(
    () => selectedItems.length > 0 && selectedItems.length <= listItemsSelectedDisplay,
    [selectedItems.length, listItemsSelectedDisplay]
  );

  // Determina si mostrar el asterisco de campo requerido
  const shouldShowAsterisk = useMemo(() => required && showRequired && safeValuesSelected.length === 0, [required, showRequired, safeValuesSelected.length]);

  // Verifica si hay elementos seleccionados temporalmente
  const hasSelectedItems = useMemo(() => tempSelectedValues.length > 0, [tempSelectedValues.length]);

  // Filtra los datos basado en el texto de búsqueda
  const filteredData = useMemo(() => {
    if (!safeData.length || !searchText) return safeData;

    return safeData.filter((item) => item[labelKey]?.toString().toLowerCase().includes(searchText.toLowerCase()));
  }, [safeData, searchText, labelKey]);

  // Determina si mostrar el campo de búsqueda
  const shouldShowSearch = useMemo(() => safeData.length > CONSTANTS.SEARCH_THRESHOLD, [safeData.length]);

  // Calcula la altura del modal
  const modalHeight = useMemo(() => getModalHeight(shouldShowSearch, searchText, filteredData.length), [shouldShowSearch, searchText, filteredData.length]);

  // Determina qué icono mostrar (loading, error, o normal)
  const icon = useMemo(() => {
    if (loading) {
      return <ActivityIndicator size={iconSize} color={colorLoading} style={[styles.iconCustom, customStyles.iconCustom]} />;
    }

    if (errorMessage) {
      return <AlertRedSVG width={iconSize} height={iconSize} style={[styles.iconCustom, customStyles.iconCustom]} />;
    }

    return iconCustom || <ChevronDownSVG width={iconSize} height={iconSize} color={iconColor} style={[styles.iconCustom, customStyles.iconCustom]} />;
  }, [loading, errorMessage, iconCustom, iconSize, iconColor, colorLoading, customStyles]);

  // Texto del botón de confirmación
  const confirmButtonTextToShow = useMemo(
    () => (hasSelectedItems ? `${confirmButtonText} (${selectedCountText})` : "Cerrar"),
    [hasSelectedItems, confirmButtonText, selectedCountText]
  );

  // Efectos

  // Sincroniza los valores seleccionados temporalmente con los props
  useEffect(() => {
    setTempSelectedValues([...safeValuesSelected]);
  }, [safeValuesSelected]);

  // Manejadores de eventos

  // Abre el modal de selección
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsVisible(true);
      setSearchText("");
    }
  }, [disabled]);

  // Cierra el modal y limpia la búsqueda
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setSearchText("");
  }, []);

  // Confirma la selección y cierra el modal
  const handleConfirmSelection = useCallback(() => {
    onChange?.(tempSelectedValues);
    handleClose();
  }, [onChange, tempSelectedValues, handleClose]);

  // Alterna la selección de un elemento en la lista temporal
  const handleToggleItem = useCallback((itemValue) => {
    setTempSelectedValues((prev) => (prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue]));
  }, []);

  // Remueve un elemento de la selección permanente (desde las tarjetas)
  const handleRemoveItem = useCallback(
    (itemValue) => {
      setTempSelectedValues((prev) => prev.filter((v) => v !== itemValue));

      const newValuesSelected = safeValuesSelected.filter((v) => v !== itemValue);

      onChange?.(newValuesSelected);
    },
    [onChange, safeValuesSelected]
  );

  // Previene el cierre del modal al tocar el contenido
  const handleOverlayPress = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Funciones de renderizado

  // Renderiza una tarjeta de elemento seleccionado
  const renderSelectedItemCard = useCallback(
    (item, index) => (
      <SelectedItemCard key={`selected-${index}`} item={item} onRemove={handleRemoveItem} labelKey={labelKey} valueKey={valueKey} customStyles={customStyles} />
    ),
    [labelKey, valueKey, customStyles, handleRemoveItem]
  );

  // Renderiza un elemento de la lista con checkbox
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = tempSelectedValues.includes(item[valueKey]);

      return (
        <TouchableOpacity
          style={[styles.item, customStyles.listItem, isSelected && [styles.selectedItem, customStyles.listItemSelected]]}
          onPress={() => handleToggleItem(item[valueKey])}
          activeOpacity={0.7}
          accessible
          accessibilityRole="checkbox"
          accessibilityLabel={`${isSelected ? "Deseleccionar" : "Seleccionar"} ${item[labelKey]}`}
          accessibilityState={{ checked: isSelected }}>
          <CheckBoxReusable
            value={item[valueKey]}
            checked={isSelected}
            onPress={() => handleToggleItem(item[valueKey])}
            title={item[labelKey]}
            textStyle={[styles.itemText, customStyles.listItemText, isSelected && [styles.selectedItemText, customStyles.listItemSelectedText]]}
            containerStyle={styles.checkboxContainer}
          />
        </TouchableOpacity>
      );
    },
    [tempSelectedValues, handleToggleItem, labelKey, valueKey, customStyles]
  );

  // Renderizado principal del componente
  return (
    <View style={[styles.container, customStyles.container]}>
      {/* Etiqueta del campo */}
      <View style={[styles.labelContainer, customStyles.labelContainer]}>
        <Text style={[styles.labelStyle, customStyles.labelStyle, errorMessage && [styles.errorLabel, customStyles.errorLabel]]}>
          {label}
          {shouldShowAsterisk && <Text style={styles.requiredAsterisk}> *</Text>}
        </Text>
      </View>

      {/* Campo de entrada principal (botón que abre el modal) */}
      <TouchableOpacity
        style={[
          styles.input,
          customStyles.input,
          errorMessage && [styles.errorInput, customStyles.errorInput],
          disabled && [styles.disabledInput, customStyles.disabledInput],
          loading && { justifyContent: "center", alignItems: "center" }
        ]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Seleccionar ${label}`}
        accessibilityHint="Abre una lista de opciones de selección múltiple">
        {loading ? (
          <ActivityIndicator size={iconSize} color={colorLoading} />
        ) : (
          <>
            {/* Texto que muestra la selección actual o placeholder */}
            <Text
              style={[
                styles.valueSelectedStyle,
                !displayValue && [styles.placeholder, customStyles.placeholder],
                customStyles.valueSelected,
                errorMessage && [styles.errorText, customStyles.errorText],
                disabled && [styles.disabledText, customStyles.disabledText]
              ]}>
              {displayValue || placeholder}
            </Text>
            {/* Icono del dropdown */}
            {icon}
          </>
        )}
      </TouchableOpacity>

      {/* Mensaje de error */}
      {errorMessage && <Text style={[styles.errorMessageStyle, customStyles.errorMessageStyle]}>{errorMessage}</Text>}

      {/* Lista de elementos seleccionados (mostrada como tarjetas) */}
      {shouldShowDetailedList && (
        <View style={[styles.selectedItemsContainer, customStyles.selectedItemsContainer]}>{selectedItems.map(renderSelectedItemCard)}</View>
      )}

      {/* Modal de selección */}
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={handleClose} statusBarTranslucent>
        <View style={[styles.modalOverlay, customStyles.modalOverlay]} onTouchEnd={handleOverlayPress}>
          <View style={[styles.modalContainer, customStyles.modalContainer]}>
            <View style={[styles.modalContent, customStyles.modalContent, { height: modalHeight }]}>
              {/* Header del modal con contador y botón cerrar */}
              <ModalHeader filteredDataLength={filteredData.length} onClose={handleClose} customStyles={customStyles} />

              {/* Contenedor de búsqueda */}
              <View style={[styles.searchAndCountContainer, customStyles.searchAndCountContainer, { marginBottom: shouldShowSearch ? 0 : -14 }]}>
                {shouldShowSearch && (
                  <SearchInput searchText={searchText} setSearchText={setSearchText} searchPlaceholder={searchPlaceholder} customStyles={customStyles} />
                )}
              </View>

              {/* Lista de elementos seleccionables */}
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item[valueKey]?.toString() || ""}${index}`}
                showsVerticalScrollIndicator
                contentContainerStyle={[styles.listContent, customStyles.listContent]}
                ListEmptyComponent={() => <ListEmptyComponent customStyles={customStyles} />}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews
                style={styles.flatList}
                scrollEnabled
              />

              {/* Botón de confirmación */}
              <View style={[styles.confirmButtonContainer, customStyles.confirmButtonContainer]}>
                <TouchableOpacity
                  style={[styles.confirmButton, customStyles.confirmButton, !hasSelectedItems && styles.emptyConfirmButton]}
                  onPress={handleConfirmSelection}
                  activeOpacity={0.7}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={confirmButtonTextToShow}>
                  <Text style={[styles.confirmButtonText, customStyles.confirmButtonText, !hasSelectedItems && styles.emptyConfirmButtonText]}>
                    {confirmButtonTextToShow}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    width: "100%"
  },
  // Contenedor de la etiqueta
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  // Estilo de la etiqueta
  labelStyle: {
    fontFamily: "SF Pro",
    fontStyle: "normal",
    fontSize: IS_IOS ? 16.5 : 16.5,
    fontWeight: IS_IOS ? "500" : "600",
    color: Colors.textPrimary
  },
  // Campo de entrada principal
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
  // Texto del valor seleccionado
  valueSelectedStyle: {
    flex: 1,
    fontSize: 15,
    color: "#0F1929"
  },
  // Estilo del placeholder
  placeholder: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  // Elemento seleccionado en la lista
  selectedItem: {
    backgroundColor: "#D9EEFF",
    borderColor: "#D9EEFF",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 4
  },
  // Texto de elemento seleccionado
  selectedItemText: {
    fontWeight: "500"
  },
  // Contenedor de elementos seleccionados
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 4
  },
  // Tarjeta de elemento seleccionado
  selectedItemCard: {
    backgroundColor: "#D9EEFF",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#DEF5FF",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    position: "relative"
  },
  // Texto de la tarjeta de elemento seleccionado
  selectedItemCardText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "500",
    fontFamily: "SF Pro",
    fontStyle: "normal"
    // marginLeft: 4
  },
  // Botón para remover elemento seleccionado
  removeItemButton: {
    position: "absolute",
    left: 6,
    top: "50%",
    marginTop: -6,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  // Estilos de error
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
  // Estilos deshabilitados
  disabledInput: {
    backgroundColor: "#F5F6F8",
    borderColor: "#E1E4E8"
  },
  disabledText: {
    color: "#94A3B8",
    fontSize: IS_IOS ? 15 : 14
  },
  // Asterisco de campo requerido
  requiredAsterisk: {
    color: "#FF4D4F"
  },
  // Icono personalizado
  iconCustom: {
    marginLeft: 8
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 0
  },
  modalContent: {
    width: "100%",
    height: "80%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#FFFFFF",
    overflow: "hidden"
  },
  // Header del modal
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  // Botón de cerrar
  closeButton: {
    position: "absolute",
    right: 16,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  // Círculo del botón de cerrar
  closeButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center"
  },
  // Icono del botón de cerrar
  closeButtonIcon: {
    color: "#464C5E"
  },
  // Contador de elementos
  itemCount: {
    fontSize: IS_IOS ? 16 : 15,
    color: "#6B758C"
  },
  // Contenedor de búsqueda
  searchAndCountContainer: {
    paddingTop: 10,
    paddingHorizontal: 8
  },
  // Contenedor del input de búsqueda
  searchInputContainer: {
    borderWidth: 1,
    borderColor: "#B3B9C5",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 8
  },
  // Icono de búsqueda
  searchIcon: {
    marginRight: 8
  },
  // Input de búsqueda
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: IS_IOS ? 16 : 14,
    color: "#464C5E",
    padding: 0
  },
  // Botón para limpiar búsqueda
  clearButton: {
    padding: 4,
    marginLeft: 8
  },
  // Icono del botón de limpiar
  clearButtonIcon: {
    color: "#464C5E"
  },
  // Contador de elementos seleccionados
  selectedCount: {
    fontSize: IS_IOS ? 15 : 15,
    color: Colors.textPrimary,
    fontWeight: "500"
  },
  // Contenido de la lista
  listContent: {
    padding: 8
  },
  // Lista plana
  flatList: {
    maxHeight: "80%"
  },
  // Elemento de la lista
  item: {
    padding: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#F0F0F0"
  },
  // Texto del elemento
  itemText: {
    fontSize: IS_IOS ? 15 : 14,
    color: "#464C5E",
    fontFamily: "SF Pro",
    fontStyle: "normal"
  },
  // Contenedor del checkbox
  checkboxContainer: {
    width: "100%",
    margin: 0,
    padding: 0
  },
  // Contenedor vacío
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  // Texto cuando no hay resultados
  emptyText: {
    fontSize: IS_IOS ? 16 : 14,
    color: "#B3B9C6",
    textAlign: "center"
  },
  // Contenedor del botón de confirmación
  confirmButtonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "center",
    marginBottom: IS_IOS ? 10 : 5
  },
  // Botón de confirmación
  confirmButton: {
    backgroundColor: "#009ED4",
    borderColor: "#009ED4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center"
  },
  // Botón de confirmación deshabilitado
  disabledConfirmButton: {
    backgroundColor: "#E2E8F0",
    borderColor: "#CBD5E1"
  },
  // Botón de confirmación vacío
  emptyConfirmButton: {
    backgroundColor: "#009ED4",
    borderColor: "#009ED4"
  },
  // Texto del botón de confirmación
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: IS_IOS ? 16 : 15,
    fontWeight: "600",
    fontFamily: "SF Pro"
  },
  // Texto del botón deshabilitado
  disabledConfirmButtonText: {
    color: "#94A3B8"
  },
  // Texto del botón vacío
  emptyConfirmButtonText: {
    color: "#FFFFFF",
    fontSize: IS_IOS ? 16 : 15,
    fontWeight: "600",
    fontFamily: "SF Pro"
  },
  // Icono del botón de remover
  removeItemButtonIcon: {
    color: "#464C5E",
    marginTop: 10
  }
});

export default DropDownListMultipleReusable;
