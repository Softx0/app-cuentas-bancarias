# 🏦 Banking Application - App Cuentas Bancarias

Una aplicación móvil para gestión bancaria desarrollada con **React Native** y **Expo**, implementando arquitectura limpia y componentes reutilizables.

## 📋 Tabla de Contenidos

- [🔧 Requisitos del Sistema](#-requisitos-del-sistema)
- [⚙️ Instalación del Ambiente de Desarrollo](#️-instalación-del-ambiente-de-desarrollo)
- [🚀 Configuración del Proyecto](#-configuración-del-proyecto)
- [🏃‍♂️ Ejecutar la Aplicación](#️-ejecutar-la-aplicación)
- [📱 Deployment y Distribución](#-deployment-y-distribución)
- [🛠️ Scripts Disponibles](#️-scripts-disponibles)
- [🔍 Debugging y Troubleshooting](#-debugging-y-troubleshooting)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🔧 Requisitos del Sistema

### 💻 **macOS (Recomendado para desarrollo iOS/Android)**
- **macOS**: 12.0 (Monterey) o superior
- **Xcode**: 14.0 o superior (para desarrollo iOS)
- **iOS Simulator**: Incluido con Xcode
- **Memory**: Mínimo 8GB RAM (16GB recomendado)
- **Storage**: 50GB libres mínimo

### 🪟 **Windows (Solo desarrollo Android)**
- **Windows**: 10/11 (64-bit)
- **Android Studio**: 2022.1.1 o superior
- **Memory**: Mínimo 8GB RAM (16GB recomendado)
- **Storage**: 50GB libres mínimo

### 🐧 **Linux (Solo desarrollo Android)**
- **Ubuntu**: 18.04 LTS o superior
- **Android Studio**: 2022.1.1 o superior

---

## ⚙️ Instalación del Ambiente de Desarrollo

### 1. 📦 **Gestores de Paquetes**

#### **macOS**
```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Verificar instalación
brew --version
```

#### **Windows**
```powershell
# Instalar Chocolatey (ejecutar como Administrador)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Verificar instalación
choco --version
```

### 2. 🟢 **Node.js (CRÍTICO - Versión Específica)**

```bash
# Versión REQUERIDA para este proyecto
Node.js: 18.17.0 LTS (Recomendado)
npm: 9.6.7 o superior
```

#### **Instalación macOS**
```bash
# Opción 1: Con Homebrew
brew install node@18

# Opción 2: Descargar desde nodejs.org
# https://nodejs.org/dist/v18.17.0/

# Verificar versión
node --version  # v18.17.0
npm --version   # 9.6.7+
```

#### **Instalación Windows**
```powershell
# Con Chocolatey
choco install nodejs-lts

# O descargar desde: https://nodejs.org/
```

### 3. 🧶 **Yarn (Gestor de Paquetes)**

```bash
# Instalar Yarn globalmente
npm install -g yarn@1.22.19

# Verificar instalación
yarn --version  # 1.22.19
```

### 4. 📱 **Expo CLI**

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli@latest

# Verificar instalación
expo --version
```

### 5. 🔧 **Git**

#### **macOS**
```bash
# Con Homebrew
brew install git

# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

#### **Windows**
```powershell
# Con Chocolatey
choco install git

# O descargar desde: https://git-scm.com/download/win
```

### 6. 📱 **Desarrollo iOS (Solo macOS)**

```bash
# Instalar Xcode desde App Store
# Instalar Xcode Command Line Tools
xcode-select --install

# Aceptar licencia
sudo xcodebuild -license accept

# Instalar iOS Simulator
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### 7. 📱 **Desarrollo Android (Todos los OS)**

#### **Instalar Android Studio**
1. Descargar desde: https://developer.android.com/studio
2. Instalar Android SDK (API Level 33+)
3. Configurar variables de entorno:

#### **macOS/Linux - Agregar al ~/.bash_profile o ~/.zshrc:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### **Windows - Variables de entorno del sistema:**
```
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
PATH = %ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools
```

### 8. 🔧 **Herramientas Adicionales**

```bash
# Watchman (para macOS/Linux - mejora performance)
# macOS
brew install watchman

# EAS CLI (para builds y deploys)
npm install -g eas-cli

# React Native Debugger (opcional pero recomendado)
# Descargar desde: https://github.com/jhen0409/react-native-debugger
```

---

## 🚀 Configuración del Proyecto

### 1. 📥 **Clonar el Repositorio**

```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/app-cuentas-bancarias.git
cd app-cuentas-bancarias

# Verificar rama
git branch -a
git checkout main  # o la rama de desarrollo
```

### 2. 📦 **Instalar Dependencias**

```bash
# Instalar dependencias del proyecto
yarn install

# Para iOS (solo macOS)
cd ios && pod install && cd ..

# Limpiar cache si hay problemas
yarn start --clear
```

### 3. 🔐 **Configurar Variables de Entorno**

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus configuraciones
nano .env  # o tu editor preferido
```

#### **Archivo .env (Completar con tus valores):**
```env
# === CONFIGURACIÓN DE AMBIENTE ===
NODE_ENV=development
EXPO_PUBLIC_API_URL=https://api.tu-backend.com
EXPO_PUBLIC_APP_VERSION=1.0.0

# === APIs EXTERNAS ===
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_key_aqui
EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_key_aqui
EXPO_PUBLIC_SENTRY_DSN=tu_sentry_dsn_aqui

# === CONFIGURACIÓN DE BASE DE DATOS ===
EXPO_PUBLIC_DATABASE_URL=tu_database_url_aqui

# === CONFIGURACIÓN DE AUTENTICACIÓN ===
EXPO_PUBLIC_AUTH_DOMAIN=tu-app.firebaseapp.com
EXPO_PUBLIC_JWT_SECRET=tu_jwt_secret_super_seguro

# === CONFIGURACIÓN DE NOTIFICACIONES ===
EXPO_PUBLIC_FCM_SENDER_ID=123456789012

# === CONFIGURACIÓN DE ANALYTICS ===
EXPO_PUBLIC_ANALYTICS_ID=tu_analytics_id

# === URLs DE SERVICIOS ===
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_MAX_RETRY_ATTEMPTS=3

# === DEBUGGING (Solo development) ===
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### 4. 🔧 **Verificar Configuración**

```bash
# Ejecutar script de verificación
node scripts/debug-check.js

# Verificar que Expo puede detectar dispositivos
expo doctor
```

---

## 🏃‍♂️ Ejecutar la Aplicación

### 📱 **Desarrollo Local**

```bash
# Iniciar Metro bundler
yarn start
# o
npm run dev-server

# Opciones específicas de plataforma
yarn ios              # Solo macOS
yarn android           # Todos los OS
yarn web              # Navegador web

# Con dispositivo específico
yarn ios-simulator    # iPhone 16 Pro Max predefinido
```

### 🔄 **Scripts de Desarrollo**

```bash
# Limpiar cache y reiniciar
yarn start --clear

# Modo desarrollo con logs detallados
yarn dev-server

# Verificar tipos TypeScript
yarn type-check

# Linting y formato de código
yarn lint              # Verificar errores
yarn lint:fix          # Corregir automáticamente
yarn format            # Formatear con Prettier
```

### 🔐 **Credenciales de Prueba para Desarrollo**

Una vez que la aplicación esté funcionando, usa estas credenciales predefinidas para probar el login:

```bash
# === CUENTAS DE PRUEBA DISPONIBLES ===
✅ eduardo@example.com    / password123
✅ maria@example.com      / password123  
✅ carlos@example.com     / password123
✅ demo@banking.com       / demo123
✅ test@banking.com       / test123
```

> **💡 Nota:** Estas credenciales funcionan con el sistema de autenticación mock integrado para desarrollo. No necesitas configurar un backend real para probar la aplicación.

### 📲 **Probar en Dispositivos**

#### **1. Expo Go (Más fácil para testing)**
1. Instalar **Expo Go** desde App Store/Google Play
2. Escanear QR code que aparece en terminal
3. La app se carga automáticamente
4. **Usar las credenciales de arriba para hacer login**

#### **2. Development Build (Recomendado para features nativas)**
```bash
# Crear development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Instalar en dispositivo físico
eas build --profile development --platform ios --local
```

---

## 📱 Deployment y Distribución

### 🏗️ **Builds de Producción**

#### **Configurar EAS (Expo Application Services)**
```bash
# Login en Expo
expo login

# Configurar EAS
eas build:configure
```

#### **Crear Builds**
```bash
# Build para iOS (App Store)
eas build --platform ios --profile production

# Build para Android (Google Play)
eas build --platform android --profile production

# Build local (para testing)
eas build --platform ios --profile production --local
```

### 🚀 **Distribución**

#### **TestFlight (iOS)**
```bash
# Submit a App Store Connect
eas submit --platform ios
```

#### **Google Play Console (Android)**
```bash
# Submit a Google Play
eas submit --platform android
```

#### **Distribución Interna**
```bash
# Crear build de preview
eas build --profile preview --platform all

# Generar link de descarga
eas update --auto
```

---

## 🛠️ Scripts Disponibles

```bash
# === DESARROLLO ===
yarn start                 # Iniciar Metro bundler
yarn dev-server           # Desarrollo con cache limpio
yarn ios                  # Ejecutar en iOS
yarn android              # Ejecutar en Android
yarn web                  # Ejecutar en navegador

# === BUILDS ===
yarn build:ios            # Build local iOS
yarn build:android        # Build local Android
yarn eas build:ios        # Build EAS iOS
yarn eas build:android    # Build EAS Android

# === CALIDAD DE CÓDIGO ===
yarn lint                 # ESLint
yarn lint:fix             # Corregir ESLint automáticamente
yarn format               # Prettier
yarn format:check         # Verificar formato
yarn type-check           # TypeScript check

# === DEBUGGING ===
yarn reset-project        # Resetear proyecto
node scripts/debug-check.js  # Verificar configuración

# === UTILIDADES ===
yarn postinstall          # Scripts post-instalación
```

---

## 🔍 Debugging y Troubleshooting

### 🚨 **Problemas Comunes**

#### **1. App Crashea al Iniciar**
```bash
# Limpiar todo el cache
yarn start --clear
rm -rf node_modules
yarn install
cd ios && rm -rf build && pod install && cd ..

# Verificar configuración
node scripts/debug-check.js
```

#### **2. Problemas con SVG Icons**
```bash
# Verificar metro.config.js
cat metro.config.js

# Reinstalar transformer
yarn add -D react-native-svg-transformer
```

#### **3. Errores de Fuentes**
```bash
# Verificar que no uses fuentes no disponibles
grep -r "SF Pro" src/ themes/
```

#### **4. Problemas con Login/Authentication**
```bash
# Si el login falla con error "structuredClone doesn't exist":
# Ya está solucionado con sistema mock para desarrollo

# Verificar que estás usando las credenciales correctas:
✅ eduardo@example.com / password123
✅ demo@banking.com / demo123

# Si persisten problemas de JWT:
# La app usa tokens mock en desarrollo automáticamente
# No necesitas configurar JWT real para testing
```

#### **5. Problemas con React 19**
```bash
# Considerar downgrade si hay incompatibilidades
yarn add react@18.2.0 react-dom@18.2.0
```

### 📊 **Logs y Debugging**

```bash
# Logs detallados
yarn start --verbose

# React Native Debugger
# Ejecutar React Native Debugger app
# En app: Cmd+D (iOS) / Cmd+M (Android) > Debug

# Flipper (Meta debugging tool)
# Instalar desde: https://fbflipper.com/
```

### 🔧 **Reset Completo**

```bash
# Script de reset total
yarn reset-project

# Manual reset
rm -rf node_modules
rm -rf .expo
rm yarn.lock
yarn install
yarn start --clear
```

---

## 📁 Estructura del Proyecto

```
app-cuentas-bancarias/
├── 📱 App.js                          # Entry point principal
├── 🔧 index.js                        # Registro de componente raíz
├── ⚙️ metro.config.js                  # Configuración Metro bundler
├── 📋 package.json                     # Dependencias y scripts
├── 🌍 env.example                      # Template variables entorno
├── 
├── 📁 src/                             # Código fuente principal
│   ├── 🏗️ infrastructure/              # Capa de infraestructura
│   │   └── services/                   # Servicios externos
│   ├── 🎯 domain/                      # Lógica de negocio
│   ├── 🎨 presentation/                # UI y navegación
│   │   ├── navigation/                 # Configuración navegación
│   │   └── screens/                    # Pantallas de la app
│   └── 🔧 shared/                      # Utilidades compartidas
├── 
├── 🎨 components/                      # Componentes reutilizables
│   ├── custom-button/                  # Botones personalizados
│   ├── custom-input/                   # Inputs personalizados
│   ├── CalendarReusable/               # Calendario
│   └── [otros componentes]/
├── 
├── 🎨 themes/                          # Sistema de diseño
│   ├── Colors.js                       # Paleta de colores
│   ├── Fonts.js                        # Tipografías
│   └── Metrics.js                      # Espaciados y métricas
├── 
├── 🔧 utils/                           # Utilidades generales
├── 📱 assets/                          # Recursos estáticos
│   ├── icons/                          # Iconos SVG
│   ├── images/                         # Imágenes
│   └── fonts/                          # Fuentes personalizadas
├── 
├── 📚 docs/                            # Documentación
├── 🔧 scripts/                         # Scripts de automatización
│   └── debug-check.js                  # Script verificación
└── 📱 ios/ & android/                  # Configuración nativa
```

---

## 🔐 Seguridad y Variables de Entorno

### 🚨 **¡IMPORTANTE!**
- ❌ **NUNCA** commitear el archivo `.env` al repositorio
- ✅ Usar `env.example` como template
- ✅ Agregar `.env` al `.gitignore`
- ✅ Usar variables `EXPO_PUBLIC_` para valores que pueden ser públicos
- ✅ Mantener secrets en variables sin prefijo (solo para builds)

---

## 👥 Contribuir

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Add nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 🚀 Stack Tecnológico

- **Frontend**: React Native 0.79.5
- **Framework**: Expo 53.x
- **Navigation**: React Navigation 7.x
- **State Management**: React Hooks + Context API + BankingContext
- **Styling**: StyleSheet + Design System
- **Icons**: React Native SVG
- **Development**: TypeScript + ESLint + Prettier
- **Build**: EAS Build
- **Deployment**: Expo Updates
- **Authentication**: JWT + AsyncStorage + Mock Auth System (Development) + Expo SecureStore
- **Banking Logic**: Mock services with real-time data consistency
- **Development Mode**: React Native compatible mock JWT tokens
- **Production Mode**: Real JWT with jose library

---

## 🆕 Últimas Actualizaciones (Septiembre 2025)

### **Características Implementadas:**
- ✅ **Sistema de Autenticación Mock**: Login funcional con credenciales predefinidas para desarrollo
- ✅ **Compatibilidad React Native**: JWT tokens mock compatibles con Hermes engine
- ✅ **Interfaz en Español**: Localización completa para usuarios hispanohablantes
- ✅ **Navegación Mejorada**: TabBar con mejor espaciado y consistencia de iconos
- ✅ **Gestión de Sesión**: Logout funcional con limpieza completa de datos
- ✅ **Contexto Bancario**: Sistema de estado unificado para balances y transacciones
- ✅ **Navegación Inteligente**: Pre-llenado de formularios y contexto de cuenta
- ✅ **Consistencia de Datos**: Una sola fuente de verdad para información bancaria
- ✅ **Experiencia de Usuario**: Alertas informativas y flujos de navegación optimizados
- ✅ **Desarrollo Sin Backend**: Sistema completamente funcional con datos mock

### **Estado Actual del Proyecto:**
- 🏗️ **Arquitectura Limpia**: Implementación completa siguiendo principios SOLID
- 🔒 **Seguridad**: Manejo seguro de tokens JWT y datos sensibles
- 📱 **UX/UI**: Interfaz intuitiva con manejo de errores en español
- ⚡ **Rendimiento**: Optimizaciones con useMemo, useCallback y componentes memoizados
- 🧪 **Calidad**: Código TypeScript con linting y formateo automático

---

**🏦 Banking Application v2.0.0** - Desarrollado con ❤️ por Eduardo Valenzuela