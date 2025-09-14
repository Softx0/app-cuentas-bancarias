# ButtonCalendar - Documentación

## 📋 Índice

1. [Introducción](#introducción)
2. [Características](#características)
3. [Instalación](#instalación)
4. [Patrón de Implementación](#patrón-de-implementación)
5. [API Reference](#api-reference)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Componentes](#componentes)
8. [Hooks](#hooks)
9. [Personalización](#personalización)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Troubleshooting](#troubleshooting)

## 🎯 Introducción

`ButtonCalendar` es un componente de calendario para React Native que permite la selección de rangos de fechas. El componente está diseñado para ser altamente personalizable y fácil de usar.

## 🚀 Características

### Funcionalidades Core
- Selección de rango de fechas
- Navegación por meses y años
- Personalización completa de estilos
- Soporte para localización
- Validación de fechas mínimas y máximas
- **Componente reutilizable CalendarPickerRangeReusable** ✨

## 📦 Instalación

### Dependencias Requeridas

```bash
# React Native Elements (para iconos)
npm install react-native-elements react-native-vector-icons

# Moment.js (para manejo de fechas)
npm install moment

# React Native DateTimePicker (para inputs de fecha)
npm install @react-native-community/datetimepicker

# PropTypes (para validación de tipos)
npm install prop-types
```

### Importaciones

```javascript
import { ButtonCalendar } from './components/ButtonCalendar/ButtonCalendar';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';
import CalendarPickerRangeReusable from './components/ButtonCalendar/CalendarPickerRangeReusable';
import CheckRender from './components/security/CheckRender';
import { DATE_FORMATS, formatDate, obtenerFechaHoy, unAnoHaciaAtras } from './utils/DateUtil';
```

## 🎨 Patrón de Implementación

### Usando CalendarPickerRangeReusable (Recomendado) ⭐

El nuevo componente reutilizable simplifica enormemente la implementación:

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native';
import CalendarPickerRangeReusable from './components/ButtonCalendar/CalendarPickerRangeReusable';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';

const MiComponenteCalendario = () => {
  const calendar = useButtonCalendarReusable();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <CalendarPickerRangeReusable
        calendarHook={calendar}
        title="Seleccionar período"
        placeholder="Toque para seleccionar fechas"
      />
    </SafeAreaView>
  );
};

export default MiComponenteCalendario;
```

### Usando CheckRender (Patrón Legacy)

El patrón original utiliza dos componentes `CheckRender` para manejar la visibilidad del calendario y mostrar las fechas seleccionadas:

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { ButtonCalendar } from './components/ButtonCalendar/ButtonCalendar';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';
import CheckRender from './components/security/CheckRender';
import { DATE_FORMATS, formatDate, obtenerFechaHoy, unAnoHaciaAtras } from './utils/DateUtil';

const MiComponenteCalendario = () => {
  const { selectedDates, isVisibleHumanCalendar, invertVisibleHumanCalendar, onApplyDates } = useButtonCalendarReusable();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#007AFF', justifyContent: 'center' }}>
      {/* CheckRender para mostrar fechas seleccionadas */}
      <CheckRender allowed={!isVisibleHumanCalendar}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            paddingVertical: 20,
            marginHorizontal: 10,
            borderRadius: 18
          }}
          onPress={invertVisibleHumanCalendar}
        >
          <View>
            <Text style={{ fontFamily: 'SF Pro', fontSize: 16, color: '#515151' }}>
              {selectedDates.startDate 
                ? formatDate(selectedDates.startDate).split('T')[0] 
                : unAnoHaciaAtras(DATE_FORMATS.MIDLEDASH_DMY)
              } - {
              selectedDates.endDate 
                ? formatDate(selectedDates.endDate).split('T')[0] 
                : obtenerFechaHoy(DATE_FORMATS.MIDLEDASH_DMY)
              }
            </Text>
          </View>
        </TouchableOpacity>
      </CheckRender>

      {/* CheckRender para mostrar el calendario */}
      <CheckRender allowed={isVisibleHumanCalendar}>
        <View style={{ flex: 1 }}>
          <ButtonCalendar
            {...selectedDates}
            onApplyDates={onApplyDates}
            cancelButton={invertVisibleHumanCalendar}
          />
        </View>
      </CheckRender>
    </SafeAreaView>
  );
};

export default MiComponenteCalendario;
```

### Ventajas del Nuevo Componente CalendarPickerRangeReusable

1. **Código más limpio y conciso**
2. **Altamente personalizable**
3. **Validación de tipos con PropTypes**
4. **Soporte para accesibilidad**
5. **Estilos personalizables**
6. **Iconos personalizables**
7. **Funciones de renderizado personalizadas**
8. **Mejor mantenibilidad**

## 📚 API Reference

### CalendarPickerRangeReusable Props

#### Props Básicas
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `calendarHook` | `object` | **Requerido** | Hook del calendario (useButtonCalendarReusable) |
| `title` | `string` | `""` | Título del componente |
| `placeholder` | `string` | `""` | Texto placeholder cuando no hay fechas |
| `showModal` | `boolean` | `true` | Si debe mostrar el modal del calendario |
| `modalAnimationType` | `string` | `"fade"` | Tipo de animación del modal |
| `dateFormat` | `string` | `DATE_FORMATS.SLASH_DMY` | Formato de fecha a usar |
| `dateSeparator` | `string` | `" - "` | Separador entre fechas |
| `disabled` | `boolean` | `false` | Si el componente está deshabilitado |
| `showTitle` | `boolean` | `false` | Si debe mostrar el título |

#### Props de Personalización
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `customStyles` | `object` | `{}` | Estilos personalizados |
| `icons` | `object` | `{}` | Iconos personalizados |
| `onPress` | `function` | `null` | Función personalizada al presionar |
| `renderCustomButton` | `function` | `null` | Función para renderizar botón personalizado |
| `renderCustomModal` | `function` | `null` | Función para renderizar modal personalizado |

#### Props de Accesibilidad
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `testID` | `string` | `"calendar-picker-range"` | ID para testing |
| `accessibilityLabel` | `string` | `null` | Label de accesibilidad |
| `accessibilityHint` | `string` | `null` | Hint de accesibilidad |

#### Props de Fallback
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `emptyStartDateFallback` | `string` | `null` | Fallback para fecha de inicio vacía |
| `emptyEndDateFallback` | `string` | `null` | Fallback para fecha de fin vacía |

### ButtonCalendar Props

#### Props Básicas
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `startDate` | `Date` | `null` | Fecha de inicio seleccionada |
| `endDate` | `Date` | `null` | Fecha de fin seleccionada |
| `onApplyDates` | `function` | **Requerido** | Callback al aplicar fechas |
| `cancelButton` | `function` | **Requerido** | Callback al cancelar |
| `minDate` | `Date` | `new Date(new Date().getFullYear() - 1, 0, 1)` | Fecha mínima seleccionable |
| `maxDate` | `Date` | `new Date()` | Fecha máxima seleccionable |

### useButtonCalendarReusable Hook

#### Constructor
```javascript
const calendar = useButtonCalendarReusable(options);
```

#### Parámetros
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `options` | `object` | `{}` | Opciones de configuración |

#### Retorna
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `selectedDates` | `object` | `{ startDate, endDate }` |
| `isVisibleHumanCalendar` | `boolean` | Estado de visibilidad del calendario |
| `invertVisibleHumanCalendar` | `function` | Función para alternar visibilidad |
| `onApplyDates` | `function` | Función para aplicar fechas seleccionadas |
| `getCalendarConfig` | `function` | Obtiene configuración actual |

## 🔧 Ejemplos de Uso

### Ejemplo Básico

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native';
import CalendarPickerRangeReusable from './components/ButtonCalendar/CalendarPickerRangeReusable';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';

const CalendarioBasico = () => {
  const calendar = useButtonCalendarReusable();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <CalendarPickerRangeReusable
        calendarHook={calendar}
        title="Seleccionar fechas"
        placeholder="Toque para seleccionar un rango"
      />
    </SafeAreaView>
  );
};

export default CalendarioBasico;
```

### Ejemplo con Personalización Completa

```javascript
import React from 'react';
import { SafeAreaView } from 'react-native';
import CalendarPickerRangeReusable from './components/ButtonCalendar/CalendarPickerRangeReusable';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';
import { DATE_FORMATS } from './utils/DateUtil';
import CustomIcon from './components/CustomIcon';

const CalendarioPersonalizado = () => {
  const calendar = useButtonCalendarReusable({
    canBeSameDay: true,
    minDate: new Date(2023, 0, 1),
    maxDate: new Date(2024, 11, 31)
  });

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <CalendarPickerRangeReusable
        calendarHook={calendar}
        title="Período de consulta"
        placeholder="Seleccione un rango de fechas"
        showTitle={true}
        modalAnimationType="slide"
        dateFormat={DATE_FORMATS.SLASH_DMY}
        dateSeparator=" al "
        customStyles={{
          container: { marginVertical: 10 },
          button: { 
            backgroundColor: '#f8f9fa',
            borderColor: '#007bff',
            borderWidth: 2
          },
          text: { 
            color: '#007bff',
            fontWeight: '600'
          },
          titleText: {
            color: '#6c757d',
            fontSize: 14
          }
        }}
        icons={{
          empty: <CustomIcon name="calendar-outline" />,
          selected: <CustomIcon name="calendar" />
        }}
        testID="custom-calendar-picker"
        accessibilityLabel="Selector de rango de fechas personalizado"
        accessibilityHint="Toque para abrir el calendario y seleccionar fechas"
      />
    </SafeAreaView>
  );
};

export default CalendarioPersonalizado;
```

### Ejemplo con Botón Personalizado

```javascript
import React from 'react';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import CalendarPickerRangeReusable from './components/ButtonCalendar/CalendarPickerRangeReusable';
import useButtonCalendarReusable from './components/ButtonCalendar/hooks/useButtonCalendarReusable';

const CalendarioConBotonPersonalizado = () => {
  const calendar = useButtonCalendarReusable();

  const renderCustomButton = ({ onPress, displayText, isNotSelected, icon }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isNotSelected ? '#e9ecef' : '#28a745',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'space-between'
      }}
    >
      <Text style={{
        color: isNotSelected ? '#6c757d' : 'white',
        fontSize: 16,
        fontWeight: '500'
      }}>
        {displayText}
      </Text>
      <View style={{ marginLeft: 10 }}>
        {icon}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <CalendarPickerRangeReusable
        calendarHook={calendar}
        placeholder="Seleccione fechas"
        renderCustomButton={renderCustomButton}
      />
    </SafeAreaView>
  );
};

export default CalendarioConBotonPersonalizado;
```

## 🎨 Componentes

### CalendarPickerRangeReusable

Componente reutilizable que encapsula toda la lógica de mostrar fechas seleccionadas y manejar la visibilidad del calendario.

**Características:**
- Totalmente parametrizable
- Soporte para estilos personalizados
- Iconos personalizables
- Funciones de renderizado personalizadas
- Validación de tipos con PropTypes
- Soporte completo para accesibilidad
- Manejo de estados disabled
- Fallbacks personalizables

### ButtonCalendar

Componente principal del calendario que maneja la selección de fechas.

## 🔗 Hooks

### useButtonCalendarReusable

Hook que maneja el estado y la lógica del calendario.

## 🎨 Personalización

### Estilos Personalizados

```javascript
const customStyles = {
  container: {
    marginVertical: 10,
    paddingHorizontal: 5
  },
  button: {
    backgroundColor: '#f8f9fa',
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 8
  },
  text: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600'
  },
  titleText: {
    color: '#6c757d',
    fontSize: 14,
    marginBottom: 8
  },
  iconContainer: {
    marginLeft: 15
  }
};
```

### Iconos Personalizados

```javascript
const customIcons = {
  empty: <MyEmptyCalendarIcon />,
  selected: <MySelectedCalendarIcon />
};
```

## ✅ Mejores Prácticas

1. **Usa CalendarPickerRangeReusable** para nuevas implementaciones
2. **Proporciona testID** para facilitar las pruebas
3. **Usa accessibilityLabel y accessibilityHint** para mejorar la accesibilidad
4. **Personaliza estilos** según el diseño de tu app
5. **Valida las fechas** usando minDate y maxDate
6. **Usa placeholder** para mejorar la UX
7. **Considera el estado disabled** cuando sea apropiado

## 🐛 Troubleshooting

### Problemas Comunes

1. **El calendario no se muestra**: Verifica que `calendarHook` esté correctamente pasado
2. **Estilos no se aplican**: Asegúrate de usar la estructura correcta en `customStyles`
3. **Iconos no aparecen**: Verifica que los SVG estén correctamente importados
4. **Fechas no se formatean**: Verifica que `dateFormat` sea válido

### Debugging

```javascript
// Agregar logs para debugging
console.log('Calendar Hook:', calendarHook);
console.log('Selected Dates:', calendarHook.selectedDates);
console.log('Is Visible:', calendarHook.isVisibleHumanCalendar);
``` 