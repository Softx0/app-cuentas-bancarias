/**
 * @fileoverview Application context for managing global app state and settings
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  useEffect, 
  useMemo,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '../../infrastructure/utils/logger';
import { inactivityManager } from '../../infrastructure/utils/inactivity';
import { STORAGE_KEYS, DEFAULT_VALUES } from '../../shared/constants';
import { ThemeMode, LoadingState } from '../../shared/types';

/**
 * Application state interface
 */
interface AppState {
  // Theme and UI
  themeMode: ThemeMode;
  isDarkMode: boolean;
  
  // Localization
  language: string;
  
  // Settings
  biometricEnabled: boolean;
  pushNotificationsEnabled: boolean;
  analyticsEnabled: boolean;
  
  // App status
  isInitialized: boolean;
  isConnected: boolean;
  loadingState: LoadingState;
  
  // Features
  features: Record<string, boolean>;
}

/**
 * Application actions
 */
type AppAction =
  | { type: 'SET_THEME_MODE'; payload: ThemeMode }
  | { type: 'SET_SYSTEM_THEME'; payload: ColorSchemeName }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_BIOMETRIC'; payload: boolean }
  | { type: 'SET_PUSH_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_ANALYTICS'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'TOGGLE_FEATURE'; payload: { feature: string; enabled: boolean } }
  | { type: 'RESTORE_SETTINGS'; payload: Partial<AppState> };

/**
 * Application context value interface
 */
interface AppContextValue extends AppState {
  // Theme methods
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  
  // Settings methods
  setLanguage: (language: string) => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  setPushNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setAnalyticsEnabled: (enabled: boolean) => Promise<void>;
  
  // App status methods
  setConnectionStatus: (connected: boolean) => void;
  setLoadingState: (loading: boolean, error?: string | null) => void;
  
  // Feature methods
  toggleFeature: (feature: string, enabled: boolean) => Promise<void>;
  isFeatureEnabled: (feature: string) => boolean;
  
  // Settings management
  restoreSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

/**
 * Initial application state
 */
const initialState: AppState = {
  themeMode: ThemeMode.SYSTEM,
  isDarkMode: Appearance.getColorScheme() === 'dark',
  language: DEFAULT_VALUES.LANGUAGE,
  biometricEnabled: false,
  pushNotificationsEnabled: false,
  analyticsEnabled: false,
  isInitialized: false,
  isConnected: true,
  loadingState: {
    isLoading: false,
    error: null,
  },
  features: {},
};

/**
 * Application reducer
 * @param state Current app state
 * @param action App action
 * @returns New app state
 */
const appReducer = (state: AppState, action: AppAction): AppState => {
  logger.debug('App reducer action', { type: action.type }, 'APP');
  
  switch (action.type) {
    case 'SET_THEME_MODE':
      return {
        ...state,
        themeMode: action.payload,
        isDarkMode: action.payload === ThemeMode.DARK || 
          (action.payload === ThemeMode.SYSTEM && Appearance.getColorScheme() === 'dark'),
      };
      
    case 'SET_SYSTEM_THEME':
      return {
        ...state,
        isDarkMode: state.themeMode === ThemeMode.SYSTEM && action.payload === 'dark',
      };
      
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
      
    case 'SET_BIOMETRIC':
      return {
        ...state,
        biometricEnabled: action.payload,
      };
      
    case 'SET_PUSH_NOTIFICATIONS':
      return {
        ...state,
        pushNotificationsEnabled: action.payload,
      };
      
    case 'SET_ANALYTICS':
      return {
        ...state,
        analyticsEnabled: action.payload,
      };
      
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };
      
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loadingState: action.payload,
      };
      
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload.feature]: action.payload.enabled,
        },
      };
      
    case 'RESTORE_SETTINGS':
      return {
        ...state,
        ...action.payload,
      };
      
    default:
      return state;
  }
};

/**
 * Application context
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Application context provider props
 */
interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Application context provider component
 * @param props Provider props
 * @returns AppProvider component
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Sets theme mode
   * @param mode Theme mode to set
   */
  const setThemeMode = useCallback(async (mode: ThemeMode): Promise<void> => {
    try {
      logger.info('Setting theme mode', { mode }, 'APP');
      
      dispatch({ type: 'SET_THEME_MODE', payload: mode });
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      
      logger.debug('Theme mode saved', { mode }, 'APP');
    } catch (error) {
      logger.error('Failed to set theme mode', error, 'APP');
    }
  }, []);

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = useCallback(async (): Promise<void> => {
    const newMode = state.isDarkMode ? ThemeMode.LIGHT : ThemeMode.DARK;
    await setThemeMode(newMode);
  }, [state.isDarkMode, setThemeMode]);

  /**
   * Sets application language
   * @param language Language code to set
   */
  const setLanguage = useCallback(async (language: string): Promise<void> => {
    try {
      logger.info('Setting language', { language }, 'APP');
      
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      
      logger.debug('Language saved', { language }, 'APP');
    } catch (error) {
      logger.error('Failed to set language', error, 'APP');
    }
  }, []);

  /**
   * Sets biometric authentication setting
   * @param enabled Whether biometric auth is enabled
   */
  const setBiometricEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      logger.info('Setting biometric enabled', { enabled }, 'APP');
      
      dispatch({ type: 'SET_BIOMETRIC', payload: enabled });
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
      
      logger.debug('Biometric setting saved', { enabled }, 'APP');
    } catch (error) {
      logger.error('Failed to set biometric setting', error, 'APP');
    }
  }, []);

  /**
   * Sets push notifications setting
   * @param enabled Whether push notifications are enabled
   */
  const setPushNotificationsEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      logger.info('Setting push notifications', { enabled }, 'APP');
      
      dispatch({ type: 'SET_PUSH_NOTIFICATIONS', payload: enabled });
      // Note: Actual push notification registration/unregistration would happen here
      
      logger.debug('Push notifications setting updated', { enabled }, 'APP');
    } catch (error) {
      logger.error('Failed to set push notifications', error, 'APP');
    }
  }, []);

  /**
   * Sets analytics setting
   * @param enabled Whether analytics are enabled
   */
  const setAnalyticsEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      logger.info('Setting analytics enabled', { enabled }, 'APP');
      
      dispatch({ type: 'SET_ANALYTICS', payload: enabled });
      // Note: Analytics initialization/teardown would happen here
      
      logger.debug('Analytics setting updated', { enabled }, 'APP');
    } catch (error) {
      logger.error('Failed to set analytics setting', error, 'APP');
    }
  }, []);

  /**
   * Sets connection status
   * @param connected Whether app is connected to internet
   */
  const setConnectionStatus = useCallback((connected: boolean): void => {
    logger.debug('Connection status changed', { connected }, 'APP');
    dispatch({ type: 'SET_CONNECTED', payload: connected });
  }, []);

  /**
   * Sets loading state
   * @param loading Whether app is loading
   * @param error Optional error message
   */
  const setLoadingState = useCallback((loading: boolean, error?: string | null): void => {
    dispatch({ 
      type: 'SET_LOADING', 
      payload: { 
        isLoading: loading, 
        error: error || null,
      },
    });
  }, []);

  /**
   * Toggles a feature flag
   * @param feature Feature name
   * @param enabled Whether feature is enabled
   */
  const toggleFeature = useCallback(async (feature: string, enabled: boolean): Promise<void> => {
    try {
      logger.info('Toggling feature', { feature, enabled }, 'APP');
      
      dispatch({ type: 'TOGGLE_FEATURE', payload: { feature, enabled } });
      
      // Save features to storage
      const updatedFeatures = { ...state.features, [feature]: enabled };
      await AsyncStorage.setItem('features', JSON.stringify(updatedFeatures));
      
      logger.debug('Feature toggled and saved', { feature, enabled }, 'APP');
    } catch (error) {
      logger.error('Failed to toggle feature', error, 'APP');
    }
  }, [state.features]);

  /**
   * Checks if a feature is enabled
   * @param feature Feature name
   * @returns True if feature is enabled
   */
  const isFeatureEnabled = useCallback((feature: string): boolean => {
    return state.features[feature] ?? false;
  }, [state.features]);

  /**
   * Restores settings from storage
   */
  const restoreSettings = useCallback(async (): Promise<void> => {
    try {
      setLoadingState(true);
      
      logger.info('Restoring app settings', undefined, 'APP');
      
      const [
        themeMode,
        language,
        biometricEnabled,
        featuresStr,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
        AsyncStorage.getItem('features'),
      ]);
      
      const restoredState: Partial<AppState> = {};
      
      if (themeMode) {
        restoredState.themeMode = themeMode as ThemeMode;
        restoredState.isDarkMode = themeMode === ThemeMode.DARK || 
          (themeMode === ThemeMode.SYSTEM && Appearance.getColorScheme() === 'dark');
      }
      
      if (language) {
        restoredState.language = language;
      }
      
      if (biometricEnabled) {
        restoredState.biometricEnabled = biometricEnabled === 'true';
      }
      
      if (featuresStr) {
        try {
          restoredState.features = JSON.parse(featuresStr);
        } catch (parseError) {
          logger.warn('Failed to parse features from storage', parseError, 'APP');
        }
      }
      
      dispatch({ type: 'RESTORE_SETTINGS', payload: restoredState });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
      
      setLoadingState(false);
      
      logger.info('App settings restored successfully', restoredState, 'APP');
    } catch (error) {
      logger.error('Failed to restore app settings', error, 'APP');
      setLoadingState(false, 'Failed to restore settings');
    }
  }, [setLoadingState]);

  /**
   * Resets all settings to defaults
   */
  const resetSettings = useCallback(async (): Promise<void> => {
    try {
      logger.info('Resetting app settings', undefined, 'APP');
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.THEME_MODE),
        AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
        AsyncStorage.removeItem('features'),
      ]);
      
      dispatch({ type: 'RESTORE_SETTINGS', payload: initialState });
      
      logger.info('App settings reset to defaults', undefined, 'APP');
    } catch (error) {
      logger.error('Failed to reset app settings', error, 'APP');
    }
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (state.themeMode === ThemeMode.SYSTEM) {
        dispatch({ type: 'SET_SYSTEM_THEME', payload: colorScheme });
      }
    });

    return () => subscription.remove();
  }, [state.themeMode]);

  // Setup inactivity monitoring
  useEffect(() => {
    const handleInactivityEvent = (event: string, data?: any) => {
      logger.debug('Inactivity event received', { event, data }, 'APP');
      
      // Handle different inactivity events as needed
      switch (event) {
        case 'background':
          // App went to background
          break;
        case 'foreground':
          // App returned to foreground
          break;
        case 'warning':
          // Show inactivity warning to user
          break;
        case 'timeout':
          // Session timed out - handled by AuthContext
          break;
        default:
          break;
      }
    };

    inactivityManager.onInactivityEvent('app', handleInactivityEvent);

    return () => {
      inactivityManager.removeInactivityCallback('app');
    };
  }, []);

  // Initialize app settings on mount
  useEffect(() => {
    restoreSettings();
  }, [restoreSettings]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: AppContextValue = useMemo(() => ({
    ...state,
    setThemeMode,
    toggleTheme,
    setLanguage,
    setBiometricEnabled,
    setPushNotificationsEnabled,
    setAnalyticsEnabled,
    setConnectionStatus,
    setLoadingState,
    toggleFeature,
    isFeatureEnabled,
    restoreSettings,
    resetSettings,
  }), [
    state,
    setThemeMode,
    toggleTheme,
    setLanguage,
    setBiometricEnabled,
    setPushNotificationsEnabled,
    setAnalyticsEnabled,
    setConnectionStatus,
    setLoadingState,
    toggleFeature,
    isFeatureEnabled,
    restoreSettings,
    resetSettings,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook to use application context
 * @returns Application context value
 * @throws Error if used outside AppProvider
 */
export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
