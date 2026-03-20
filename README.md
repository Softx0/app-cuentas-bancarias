## Project Configuration

### 1. Clone the Repository

```bash
# Clone the project
git clone https://github.com/your-username/app-bank-accounts.git
cd app-bank-accounts

# Check branch
git branch -a
git checkout master  # or the development branch
```

### 2. Install Dependencies

```bash
# Install project dependencies
yarn install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Clear cache if there are issues
yarn start --clear
```

### 3. Configure Environment Variables

```bash
# Copy the example file
cp env.example .env

# Edit .env with your settings
nano .env  # or your preferred editor
```

#### .env File (Fill in your values):
```env
# === ENVIRONMENT CONFIGURATION ===
NODE_ENV=development
EXPO_PUBLIC_API_URL=https://api.your-backend.com
EXPO_PUBLIC_APP_VERSION=1.0.0

# === EXTERNAL APIs ===
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key_here
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here

# === DATABASE CONFIGURATION ===
EXPO_PUBLIC_DATABASE_URL=your_database_url_here

# === AUTH CONFIGURATION ===
EXPO_PUBLIC_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_JWT_SECRET=your_super_secure_jwt_secret

# === NOTIFICATIONS CONFIGURATION ===
EXPO_PUBLIC_FCM_SENDER_ID=123456789012

# === ANALYTICS CONFIGURATION ===
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id

# === SERVICE URLs ===
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_MAX_RETRY_ATTEMPTS=3

# === DEBUGGING (Development only) ===
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### 4. Verify Configuration

```bash
# Run verification script
node scripts/debug-check.js

# Verify Expo can detect devices
expo doctor
```

---

## Run the Application

### Local Development

```bash
# Start Metro bundler
yarn start
# or
npm run dev-server

# Platform-specific options
yarn ios              # macOS only
yarn android          # All OS
yarn web              # Web browser

# With specific device
yarn ios-simulator    # Predefined iPhone 16 Pro Max
```

### Development Scripts

```bash
# Clear cache and restart
yarn start --clear

# Development mode with detailed logs
yarn dev-server

# Check TypeScript types
yarn type-check

# Linting and code formatting
yarn lint              # Check for errors
yarn lint:fix          # Auto-fix
yarn format            # Format with Prettier
```

### Test Credentials for Development

Once the app is running, use these predefined credentials to test the login:

```bash
# === AVAILABLE TEST ACCOUNTS ===
eduardo@example.com    / password123
maria@example.com      / password123
carlos@example.com     / password123
demo@banking.com       / demo123
test@banking.com       / test123
```

> Note: These credentials work with the built-in mock authentication system for development.
> You do not need to configure a real backend to test the application.

### Testing on Devices

#### 1. Expo Go (Easiest for testing)
1. Install Expo Go from the App Store / Google Play
2. Scan the QR code shown in the terminal
3. The app loads automatically
4. Use the credentials above to log in

#### 2. Development Build (Recommended for native features)
```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on physical device
eas build --profile development --platform ios --local
```

---

## Deployment and Distribution

### Production Builds

#### Set Up EAS (Expo Application Services)
```bash
# Log in to Expo
expo login

# Configure EAS
eas build:configure
```

#### Create Builds
```bash
# Build for iOS (App Store)
eas build --platform ios --profile production

# Build for Android (Google Play)
eas build --platform android --profile production

# Local build (for testing)
eas build --platform ios --profile production --local
```

### Distribution

#### TestFlight (iOS)
```bash
# Submit to App Store Connect
eas submit --platform ios
```

#### Google Play Console (Android)
```bash
# Submit to Google Play
eas submit --platform android
```

#### Internal Distribution
```bash
# Create preview build
eas build --profile preview --platform all

# Generate download link
eas update --auto
```

---

## Available Scripts

```bash
# === DEVELOPMENT ===
yarn start                 # Start Metro bundler
yarn dev-server           # Development with clean cache
yarn ios                  # Run on iOS
yarn android              # Run on Android
yarn web                  # Run in browser

# === BUILDS ===
yarn build:ios            # Local iOS build
yarn build:android        # Local Android build
yarn eas build:ios        # EAS iOS build
yarn eas build:android    # EAS Android build

# === CODE QUALITY ===
yarn lint                 # ESLint
yarn lint:fix             # Auto-fix ESLint
yarn format               # Prettier
yarn format:check         # Check formatting
yarn type-check           # TypeScript check

# === DEBUGGING ===
yarn reset-project        # Reset project
node scripts/debug-check.js  # Verify configuration

# === UTILITIES ===
yarn postinstall          # Post-install scripts
```

---

## Debugging and Troubleshooting

### Common Issues

#### 1. App Crashes on Startup
```bash
# Clear all cache
yarn start --clear
rm -rf node_modules
yarn install
cd ios && rm -rf build && pod install && cd ..

# Verify configuration
node scripts/debug-check.js
```

#### 2. SVG Icon Issues
```bash
# Check metro.config.js
cat metro.config.js

# Reinstall transformer
yarn add -D react-native-svg-transformer
```

#### 3. Font Errors
```bash
# Make sure you're not using unavailable fonts
grep -r "SF Pro" src/ themes/
```

#### 4. Login / Authentication Issues
```bash
# If login fails with "structuredClone doesn't exist" error:
# Already fixed with mock system for development

# Verify you're using the correct credentials:
eduardo@example.com / password123
demo@banking.com / demo123

# If JWT issues persist:
# The app uses mock tokens in development automatically
# You do not need to configure real JWT for testing
```

#### 5. React 19 Issues
```bash
# Consider downgrading if there are incompatibilities
yarn add react@18.2.0 react-dom@18.2.0
```

### Logs and Debugging

```bash
# Verbose logs
yarn start --verbose

# React Native Debugger
# Run the React Native Debugger app
# In app: Cmd+D (iOS) / Cmd+M (Android) > Debug

# Flipper (Meta debugging tool)
# Install from: https://fbflipper.com/
```

### Full Reset

```bash
# Full reset script
yarn reset-project

# Manual reset
rm -rf node_modules
rm -rf .expo
rm yarn.lock
yarn install
yarn start --clear
```

---

## Project Structure

```
app-bank-accounts/
├── App.js                          # Main entry point
├── index.js                        # Root component registration
├── metro.config.js                 # Metro bundler configuration
├── package.json                    # Dependencies and scripts
├── env.example                     # Environment variable template
│
├── src/                            # Main source code
│   ├── infrastructure/             # Infrastructure layer
│   │   └── services/               # External services
│   ├── domain/                     # Business logic
│   ├── presentation/               # UI and navigation
│   │   ├── navigation/             # Navigation configuration
│   │   └── screens/                # App screens
│   └── shared/                     # Shared utilities
│
├── components/                     # Reusable components
│   ├── custom-button/              # Custom buttons
│   ├── custom-input/               # Custom inputs
│   ├── CalendarReusable/           # Calendar
│   └── [other components]/
│
├── themes/                         # Design system
│   ├── Colors.js                   # Color palette
│   ├── Fonts.js                    # Typography
│   └── Metrics.js                  # Spacing and metrics
│
├── utils/                          # General utilities
├── assets/                         # Static resources
│   ├── icons/                      # SVG icons
│   ├── images/                     # Images
│   └── fonts/                      # Custom fonts
│
├── docs/                           # Documentation
├── scripts/                        # Automation scripts
│   └── debug-check.js              # Verification script
└── ios/ & android/                 # Native configuration
```

---

## Security and Environment Variables

### IMPORTANT!
- NEVER commit the .env file to the repository
- Use env.example as a template
- Add .env to .gitignore
- Use EXPO_PUBLIC_ variables for values that can be public
- Keep secrets in variables without the prefix (for builds only)

---

## Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/new-feature
3. Commit changes: git commit -m 'Add new feature'
4. Push to the branch: git push origin feature/new-feature
5. Create a Pull Request

---

## Tech Stack

- Frontend: React Native 0.83.x+
- Framework: Expo 55.x
- Navigation: React Navigation 7.x
- State Management: React Hooks + Context API + BankingContext
- Styling: StyleSheet + Design System
- Icons: React Native SVG
- Development: TypeScript + ESLint + Prettier
- Build: EAS Build
- Deployment: Expo Updates
- Authentication: JWT + AsyncStorage + Mock Auth System (Development) + Expo SecureStore
- Banking Logic: Mock services with real-time data consistency
- Development Mode: React Native compatible mock JWT tokens
- Production Mode: Real JWT with jose library

---

Banking Application - Developed with love by Eduardo Valenzuela
