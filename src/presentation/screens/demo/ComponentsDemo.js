/**
 * Components Demo Screen - Banking Application
 * 
 * This screen serves as a comprehensive testing and validation environment
 * for all components in the banking application. It demonstrates proper usage,
 * different states, and styling options for each component.
 * 
 * @description Main demo screen for component testing
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import Colors and Themes
import Colors from "../../../../themes/Colors";
import { FontSize } from "../../../../themes/Fonts";
import Metrics from "../../../../themes/Metrics";

// Import Navigation Service
import NavigationService from "../../../infrastructure/services/NavigationService";

// Import Button Components
import ButtonLiteReusable from "../../../../components/custom-button/ButtonLiteReusable";
import ButtonNavigationBarReusable from "../../../../components/custom-button/ButtonNavigationBarReusable";
import ReusableButton from "../../../../components/custom-button/ReusableButton";

// Import Input Components
import InputTextReusable from "../../../../components/custom-input/InputTextReusable";
import SearchTextInputReusable from "../../../../components/search-text-input/SearchTextInputReusable";

// Import Checkbox/Radio Components  
import CheckBoxReusable from "../../../../components/custom-checkbox/CheckBoxReusable";
import CustomCheckbox from "../../../../components/custom-checkbox/customCheckbox";
import RadioButtonDoubleReusable from "../../../../components/custom-radio-button/RadioButtonDoubleReusable";
import RadioButtonReusable from "../../../../components/custom-radio-button/RadioButtonReusable";

// Import Dropdown Components
import DropDownListCountryReusable from "../../../../components/custom-dropdown/DropDownListCountryReusable";
import DropDownListMultipleReusable from "../../../../components/custom-dropdown/DropDownListMultipleReusable";
import DropDownListReusable from "../../../../components/custom-dropdown/DropDownListReusable";

// Import Calendar Components
import CalendarPickerRangeReusable from "../../../../components/CalendarReusable/CalendarPickerRangeReusable";
import useHumanCalendar from "../../../../components/CalendarReusable/hooks/useHumanCalendar";

// Import Utility Components
import ConditionalRendererReusable from "../../../../components/conditional-renderer-reusable/ConditionalRendererReusable";
import CustomSeparator from "../../../../components/custom-separator/CustomSeparator";
import Loading from "../../../../components/loading/Loading";
import TabBarReusable from "../../../../components/reusable-TabBar/TabBarReusable";
import CheckRender from "../../../../components/security/CheckRender";
import { Snackbar } from "../../../../components/snackbar/Snackbar";
import StepInfo from "../../../../components/stepInfo/StepInfo";

// Demo Icons (you can replace with actual SVG imports)
const DemoIcon = () => <Text style={{ fontSize: 20 }}>🎯</Text>;
const HomeIcon = () => <Text style={{ fontSize: 20 }}>🏠</Text>;
const ProfileIcon = () => <Text style={{ fontSize: 20 }}>👤</Text>;
const SettingsIcon = () => <Text style={{ fontSize: 20 }}>⚙️</Text>;

/**
 * ComponentsDemo - Main demo screen component
 */
const ComponentsDemo = () => {
  // State for component testing
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [customCheckboxValue, setCustomCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  const [leftRadio, setLeftRadio] = useState(false);
  const [rightRadio, setRightRadio] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [multipleValues, setMultipleValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showLoadingState, setShowLoadingState] = useState(false);

  // Calendar hook
  const calendar = useHumanCalendar({
    canBeSameDay: true,
    minDate: new Date(new Date().getFullYear() - 1, 0, 1),
    maxDate: new Date()
  });

  // Demo data
  const dropdownData = [
    { label: "Opción 1", value: "option1" },
    { label: "Opción 2", value: "option2" },
    { label: "Opción 3", value: "option3" },
  ];

  const countryData = [
    { countryName: "República Dominicana", idCountry: "DO", flag: "🇩🇴" },
    { countryName: "Estados Unidos", idCountry: "US", flag: "🇺🇸" },
    { countryName: "España", idCountry: "ES", flag: "🇪🇸" },
  ];

  const tabData = [
    { label: "Inicio", icon: <HomeIcon />, disabled: false },
    { label: "Perfil", icon: <ProfileIcon />, disabled: false },
    { label: "Configuración", icon: <SettingsIcon />, disabled: true },
  ];

  const navigationButtons = [
    {
      titleButton: "Inicio",
      onPressActionButton: () => Alert.alert("Navegación", "Inicio presionado"),
      iconButton: <HomeIcon />,
      accessibilityLabel: "Ir al inicio"
    },
    {
      titleButton: "Perfil", 
      onPressActionButton: () => Alert.alert("Navegación", "Perfil presionado"),
      iconButton: <ProfileIcon />,
      accessibilityLabel: "Ver perfil"
    },
    {
      titleButton: "Config",
      onPressActionButton: () => Alert.alert("Navegación", "Configuración presionada"), 
      iconButton: <SettingsIcon />,
      disabled: true,
      accessibilityLabel: "Configuración (deshabilitada)"
    }
  ];

  // Demo handlers
  const handleButtonPress = (buttonName) => {
    Alert.alert("Botón Presionado", `${buttonName} fue presionado`);
  };

  // Navigation handlers using NavigationService
  const handleComponentDetail = (componentName, componentType) => {
    NavigationService.navigateToComponentDetail(componentName, componentType);
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSnackbar(true);
    }, 2000);
  };

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏦 Banking Components Demo</Text>
          <Text style={styles.subtitle}>Prueba y valida todos los componentes</Text>
        </View>

        {/* Button Components Section */}
        {renderSection("🔘 Button Components", (
          <>
            <Text style={styles.componentTitle}>Primary Action Button</Text>
            <ReusableButton
              titleButton="Botón Principal"
              onPressActionButton={() => handleButtonPress("Primary Button")}
              iconButton={<DemoIcon />}
              iconPosition={0}
            />
            
            <ReusableButton
              titleButton="View Details"
              onPressActionButton={() => handleComponentDetail('ReusableButton', 'Button Components')}
              buttonStyle={{ marginTop: 10 }}
            />
            
            <ReusableButton
              titleButton="Botón Cargando"
              onPressActionButton={handleLoadingTest}
              loading={loading}
              buttonStyle={{ marginTop: 10 }}
            />

            <ReusableButton
              titleButton="Botón Deshabilitado"
              onPressActionButton={() => {}}
              disabled={true}
              buttonStyle={{ marginTop: 10 }}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>List/Menu Button</Text>
            <ButtonLiteReusable
              text="Configuración de Cuenta"
              onPress={() => handleButtonPress("List Button")}
              leftIcon={<SettingsIcon />}
            />
            
            <ButtonLiteReusable
              text="View ButtonLite Details"
              onPress={() => handleComponentDetail('ButtonLiteReusable', 'Button Components')}
              buttonStyle={{ marginTop: 10 }}
            />

            <ButtonLiteReusable
              text="Seleccionar Fecha"
              onPress={() => handleButtonPress("Date Button")}
              rightIcon={<DemoIcon />}
              isDisabled={false}
              buttonStyle={{ marginTop: 10 }}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Navigation Bar</Text>
            <ButtonNavigationBarReusable 
              buttons={navigationButtons}
              showIndicator={true}
            />
          </>
        ))}

        {/* Input Components Section */}
        {renderSection("📝 Input Components", (
          <>
            <Text style={styles.componentTitle}>Text Input</Text>
            <InputTextReusable
              label="Nombre Completo"
              placeholder="Ingresa tu nombre"
              value={inputValue}
              onChangeText={setInputValue}
              required={true}
            />

            <InputTextReusable
              label="Email"
              placeholder="ejemplo@email.com"
              keyboardType="email-address"
              errorMessage={inputValue === "error" ? "Email inválido" : undefined}
              containerStyle={{ marginTop: 15 }}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Search Input</Text>
            <SearchTextInputReusable
              placeholder="Buscar transacciones..."
              value={searchValue}
              onValueChange={setSearchValue}
              filterText="Filtros"
            />
          </>
        ))}

        {/* Checkbox/Radio Components Section */}
        {renderSection("☑️ Selection Components", (
          <>
            <Text style={styles.componentTitle}>Checkbox</Text>
            <CheckBoxReusable
              title="Acepto términos y condiciones"
              checked={checkboxValue}
              onPress={() => setCheckboxValue(!checkboxValue)}
              value="terms"
            />

            <CustomCheckbox
              label="Recibir notificaciones por email"
              isSelected={customCheckboxValue}
              onSelect={() => setCustomCheckboxValue(!customCheckboxValue)}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Radio Buttons</Text>
            <RadioButtonReusable
              title="Tipo de Cuenta"
              label="Cuenta Corriente"
              value="corriente"
              checked={radioValue === "corriente"}
              onPress={(value) => setRadioValue(value)}
              required={true}
            />

            <RadioButtonDoubleReusable
              titleRadios="Género"
              labelLeft="Masculino"
              labelRight="Femenino"
              valueLeft="M"
              valueRight="F"
              checkedLeft={leftRadio}
              checkedRight={rightRadio}
              onPressLeft={() => {
                setLeftRadio(true);
                setRightRadio(false);
              }}
              onPressRight={() => {
                setLeftRadio(false);
                setRightRadio(true);
              }}
              containerStyle={{ marginTop: 15 }}
            />
          </>
        ))}

        {/* Dropdown Components Section */}
        {renderSection("📋 Dropdown Components", (
          <>
            <Text style={styles.componentTitle}>Simple Dropdown</Text>
            <DropDownListReusable
              label="Tipo de Documento"
              data={dropdownData}
              valueSelected={dropdownValue}
              onChange={(item) => setDropdownValue(item)}
              placeholder="Selecciona una opción"
              required={true}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Country Dropdown</Text>
            <DropDownListCountryReusable
              label="País"
              data={countryData}
              valueSelected={null}
              onChange={(item) => console.log("Country selected:", item)}
              placeholder="Selecciona un país"
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Multiple Selection</Text>
            <DropDownListMultipleReusable
              label="Servicios"
              data={dropdownData}
              valuesSelected={multipleValues}
              onChange={(items) => setMultipleValues(items)}
              placeholder="Selecciona servicios"
              confirmButtonText="Confirmar Selección"
            />
          </>
        ))}

        {/* Calendar Components Section */}
        {renderSection("📅 Calendar Components", (
          <>
            <Text style={styles.componentTitle}>Date Range Picker</Text>
            <CalendarPickerRangeReusable
              calendarHook={calendar}
              title="Período de Consulta"
              placeholder="Selecciona un rango de fechas"
              showTitle={true}
            />
          </>
        ))}

        {/* Utility Components Section */}
        {renderSection("🔧 Utility Components", (
          <>
            <Text style={styles.componentTitle}>Loading</Text>
            <View style={styles.utilityRow}>
              <Loading size="small" color={Colors.primary[300]} />
              <Loading size="large" color={Colors.secondary[300]} />
            </View>

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Step Info</Text>
            <StepInfo
              stepNumber={1}
              totalSteps={3}
              title="Información Personal"
              subtitle="Completa tus datos básicos"
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Tab Bar</Text>
            <TabBarReusable
              tabs={tabData}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Separator</Text>
            <CustomSeparator />

            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Conditional Renderer</Text>
            <View style={styles.conditionalButtons}>
              <ReusableButton
                titleButton="Show Error"
                onPressActionButton={() => setShowError(true)}
                buttonStyle={styles.smallButton}
              />
              <ReusableButton
                titleButton="Show No Results"
                onPressActionButton={() => setShowNoResults(true)}
                buttonStyle={styles.smallButton}
              />
              <ReusableButton
                titleButton="Show Loading"
                onPressActionButton={() => setShowLoadingState(true)}
                buttonStyle={styles.smallButton}
              />
            </View>

            <ConditionalRendererReusable
              hasError={showError}
              hasNoResults={showNoResults}
              hasLoading={showLoadingState}
              onRetry={() => {
                setShowError(false);
                setShowNoResults(false);
                setShowLoadingState(false);
              }}
              onBack={() => {
                setShowError(false);
                setShowNoResults(false);
                setShowLoadingState(false);
              }}
              texts={{
                errorTitle: "Error de Demostración",
                emptyTitle: "Sin Datos de Demo"
              }}
            >
              <Text style={styles.successMessage}>
                ✅ Todos los estados funcionan correctamente
              </Text>
            </ConditionalRendererReusable>
          </>
        ))}

        {/* Check Render Demo */}
        {renderSection("👁️ Check Render Component", (
          <>
            <Text style={styles.componentTitle}>Conditional Visibility</Text>
            <CheckRender allowed={checkboxValue}>
              <View style={styles.hiddenContent}>
                <Text style={styles.hiddenText}>
                  🎉 Este contenido solo se muestra cuando el checkbox está activado
                </Text>
              </View>
            </CheckRender>
          </>
        ))}

        {/* Snackbar */}
        <Snackbar
          visible={showSnackbar}
          message="¡Componentes validados exitosamente!"
          duration={3000}
          onActionPress={() => setShowSnackbar(false)}
          actionText="Cerrar"
          iconComponent={<Text style={{ color: 'white' }}>✅</Text>}
        />

        {/* Navigation Service Demo */}
        {renderSection("🧭 Navigation Service Demo", (
          <>
            <Text style={styles.componentTitle}>Programmatic Navigation</Text>
            <Text style={styles.description}>
              Navigate to component detail screens using NavigationService:
            </Text>
            
            <ButtonLiteReusable
              text="Navigate to Button Details"
              onPress={() => NavigationService.navigateToComponentDetail('ReusableButton', 'Button Components')}
              buttonStyle={{ marginTop: 15 }}
            />
            
            <ButtonLiteReusable
              text="Navigate to ButtonLite Details"
              onPress={() => NavigationService.navigateToComponentDetail('ButtonLiteReusable', 'Button Components')}
              buttonStyle={{ marginTop: 10 }}
            />
            
            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Current Route</Text>
            <Text style={styles.description}>
              Current route: {NavigationService.getCurrentRoute() || 'Unknown'}
            </Text>
            
            <Text style={[styles.componentTitle, { marginTop: 20 }]}>Navigation Status</Text>
            <Text style={styles.description}>
              Navigation ready: {NavigationService.isReady() ? '✅ Yes' : '❌ No'}
            </Text>
          </>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🏦 Banking App Components Demo v2.0.0 - Powered by NavigationService
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Metrics.large,
  },
  header: {
    alignItems: "center",
    marginBottom: Metrics.xxLarge,
    paddingVertical: Metrics.large,
    backgroundColor: Colors.primary[100],
    borderRadius: 12,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: "bold",
    color: Colors.primary[400],
    marginBottom: Metrics.small,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.medium,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: Metrics.xxLarge,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Metrics.large,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: Colors.primary[400],
    marginBottom: Metrics.medium,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[100],
    paddingBottom: Metrics.small,
  },
  sectionContent: {
    marginTop: Metrics.medium,
  },
  componentTitle: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Metrics.medium,
    marginTop: Metrics.small,
  },
  utilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: Metrics.large,
  },
  conditionalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Metrics.large,
  },
  smallButton: {
    flex: 0.3,
    paddingVertical: 8,
  },
  successMessage: {
    textAlign: "center",
    color: Colors.success,
    fontSize: FontSize.medium,
    fontWeight: "500",
    paddingVertical: Metrics.large,
  },
  description: {
    fontSize: FontSize.medium,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Metrics.small,
  },
  hiddenContent: {
    backgroundColor: Colors.success,
    padding: Metrics.medium,
    borderRadius: 8,
    marginTop: Metrics.small,
  },
  hiddenText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingVertical: Metrics.xxLarge,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.small,
    fontStyle: "italic",
  },
});

export default ComponentsDemo;
