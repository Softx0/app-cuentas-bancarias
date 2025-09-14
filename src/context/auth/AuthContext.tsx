/**
 * @fileoverview Authentication context for managing user authentication state
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { apiService } from '../../infrastructure/services/api.service';
import { inactivityManager } from '../../infrastructure/utils/inactivity';
import { jwtUtil } from '../../infrastructure/utils/jwt';
import { logger } from '../../infrastructure/utils/logger';
import { STORAGE_KEYS } from '../../shared/constants';
import type { AuthState, AuthToken, User } from '../../shared/types';

/**
 * Authentication actions
 */
type AuthAction =
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthToken } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'TOKEN_REFRESH'; payload: AuthToken }
  | { type: 'USER_UPDATE'; payload: User };

/**
 * Authentication context value interface
 */
interface AuthContextValue extends AuthState {
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // Token methods
  checkTokenValidity: () => Promise<boolean>;
  clearAuthState: () => Promise<void>;
  
  // Session methods
  restoreSession: () => Promise<void>;
  isSessionValid: () => boolean;
}

/**
 * Registration data interface
 */
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication reducer
 * @param state Current auth state
 * @param action Auth action
 * @returns New auth state
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  logger.debug('Auth reducer action', { type: action.type }, 'AUTH');
  
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      
    case 'TOKEN_REFRESH':
      return {
        ...state,
        tokens: action.payload,
        error: null,
      };
      
    case 'USER_UPDATE':
      return {
        ...state,
        user: action.payload,
        error: null,
      };
      
    default:
      return state;
  }
};

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication context provider props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication context provider component
 * @param props Provider props
 * @returns AuthProvider component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Stores authentication data securely
   * @param user User data
   * @param tokens Authentication tokens
   */
  const storeAuthData = useCallback(async (user: User, tokens: AuthToken): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken),
        tokens.refreshToken && AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      ]);
      
      apiService.setAuthToken(tokens.accessToken);
      
      logger.info('Auth data stored successfully', { userId: user.id }, 'AUTH');
    } catch (error) {
      logger.error('Failed to store auth data', error, 'AUTH');
      throw new Error('Failed to store authentication data');
    }
  }, []);

  /**
   * Clears stored authentication data
   */
  const clearAuthData = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      
      apiService.clearAuthToken();
      
      logger.info('Auth data cleared', undefined, 'AUTH');
    } catch (error) {
      logger.error('Failed to clear auth data', error, 'AUTH');
    }
  }, []);

  /**
   * Logs in a user with email and password
   * @param email User email
   * @param password User password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      
      logger.info('Attempting user login', { email }, 'AUTH');
      
      const response = await apiService.post<{ user: User; tokens: AuthToken }>('/auth/login', {
        email,
        password,
      });
      
      const { user, tokens } = response.data;
      
      await storeAuthData(user, tokens);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } });
      
      // Reset inactivity timer after successful login
      inactivityManager.resetTimer();
      
      logger.info('User login successful', { userId: user.id }, 'AUTH');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      logger.error('User login failed', error, 'AUTH');
      throw error;
    }
  }, [storeAuthData]);

  /**
   * Registers a new user
   * @param userData User registration data
   */
  const register = useCallback(async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      
      logger.info('Attempting user registration', { email: userData.email }, 'AUTH');
      
      const response = await apiService.post<{ user: User; tokens: AuthToken }>('/auth/register', userData);
      
      const { user, tokens } = response.data;
      
      await storeAuthData(user, tokens);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } });
      
      logger.info('User registration successful', { userId: user.id }, 'AUTH');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      logger.error('User registration failed', error, 'AUTH');
      throw error;
    }
  }, [storeAuthData]);

  /**
   * Logs out the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      logger.info('User logout initiated', { userId: state.user?.id }, 'AUTH');
      
      // Call logout endpoint if user is authenticated
      if (state.isAuthenticated && state.tokens?.refreshToken) {
        try {
          await apiService.post('/auth/logout', {
            refreshToken: state.tokens.refreshToken,
          });
        } catch (error) {
          logger.warn('Logout endpoint failed, continuing with local logout', error, 'AUTH');
        }
      }
      
      await clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
      
      logger.info('User logout completed', undefined, 'AUTH');
    } catch (error) {
      logger.error('Logout failed', error, 'AUTH');
      // Still clear local data even if logout endpoint fails
      await clearAuthData();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, [state.user?.id, state.isAuthenticated, state.tokens?.refreshToken, clearAuthData]);

  /**
   * Refreshes the access token
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      if (!state.tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      logger.debug('Refreshing access token', undefined, 'AUTH');
      
      const response = await apiService.post<{ tokens: AuthToken }>('/auth/refresh', {
        refreshToken: state.tokens.refreshToken,
      });
      
      const { tokens } = response.data;
      
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
      if (tokens.refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }
      
      apiService.setAuthToken(tokens.accessToken);
      
      dispatch({ type: 'TOKEN_REFRESH', payload: tokens });
      
      logger.info('Access token refreshed successfully', undefined, 'AUTH');
    } catch (error) {
      logger.error('Token refresh failed', error, 'AUTH');
      await logout();
      throw error;
    }
  }, [state.tokens?.refreshToken, logout]);

  /**
   * Updates user data
   * @param userData Partial user data to update
   */
  const updateUser = useCallback(async (userData: Partial<User>): Promise<void> => {
    try {
      if (!state.user) {
        throw new Error('No user to update');
      }
      
      logger.debug('Updating user data', { userId: state.user.id }, 'AUTH');
      
      const response = await apiService.put<{ user: User }>(`/users/${state.user.id}`, userData);
      
      const updatedUser = response.data.user;
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      dispatch({ type: 'USER_UPDATE', payload: updatedUser });
      
      logger.info('User data updated successfully', { userId: updatedUser.id }, 'AUTH');
    } catch (error) {
      logger.error('User update failed', error, 'AUTH');
      throw error;
    }
  }, [state.user]);

  /**
   * Checks if current token is valid
   * @returns True if token is valid
   */
  const checkTokenValidity = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.tokens?.accessToken) return false;
      
      const verification = await jwtUtil.verifyToken(state.tokens.accessToken);
      
      if (!verification.isValid) {
        if (verification.isExpired && state.tokens.refreshToken) {
          await refreshToken();
          return true;
        }
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Token validity check failed', error, 'AUTH');
      return false;
    }
  }, [state.tokens?.accessToken, state.tokens?.refreshToken, refreshToken]);

  /**
   * Clears authentication state
   */
  const clearAuthState = useCallback(async (): Promise<void> => {
    await clearAuthData();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, [clearAuthData]);

  /**
   * Restores authentication session from storage
   */
  const restoreSession = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      
      logger.debug('Restoring authentication session', undefined, 'AUTH');
      
      const [userDataStr, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      
      if (!userDataStr || !accessToken) {
        dispatch({ type: 'AUTH_LOADING', payload: false });
        return;
      }
      
      const user = JSON.parse(userDataStr) as User;
      const tokens: AuthToken = {
        accessToken,
        refreshToken: refreshToken || undefined,
        expiresIn: 3600, // Will be updated after token verification
        tokenType: 'Bearer',
      };
      
      // Verify token validity
      const isValid = await checkTokenValidity();
      
      if (isValid) {
        apiService.setAuthToken(accessToken);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user, tokens } });
        logger.info('Authentication session restored', { userId: user.id }, 'AUTH');
      } else {
        await clearAuthData();
        dispatch({ type: 'AUTH_LOADING', payload: false });
        logger.warn('Stored tokens are invalid, session not restored', undefined, 'AUTH');
      }
    } catch (error) {
      logger.error('Session restoration failed', error, 'AUTH');
      await clearAuthData();
      dispatch({ type: 'AUTH_LOADING', payload: false });
    }
  }, [checkTokenValidity, clearAuthData]);

  /**
   * Checks if session is valid
   * @returns True if session is valid
   */
  const isSessionValid = useCallback((): boolean => {
    return state.isAuthenticated && state.tokens?.accessToken != null;
  }, [state.isAuthenticated, state.tokens?.accessToken]);

  // Setup inactivity management
  useEffect(() => {
    const handleInactivity = (event: string) => {
      if (event === 'timeout' && state.isAuthenticated) {
        logger.warn('Session timed out due to inactivity', undefined, 'AUTH');
        logout();
      }
    };

    inactivityManager.onInactivityEvent('auth', handleInactivity);

    return () => {
      inactivityManager.removeInactivityCallback('auth');
    };
  }, [state.isAuthenticated, logout]);

  // Initialize session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const contextValue: AuthContextValue = {
    ...state,
    login,
    logout,
    register,
    refreshToken,
    updateUser,
    checkTokenValidity,
    clearAuthState,
    restoreSession,
    isSessionValid,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use authentication context
 * @returns Authentication context value
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
