/**
 * @fileoverview Authentication context powered by AWS Amplify Auth
 * @version 2.0.0
 */

import {
  confirmSignUp,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { logger } from '../../infrastructure/utils/logger';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AmplifyUser {
  userId: string;
  username: string; // email in our case
}

interface AuthState {
  user: AmplifyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  /** Set when sign-up needs OTP confirmation */
  pendingConfirmationEmail: string | null;
}

type AuthAction =
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_SUCCESS'; payload: AmplifyUser }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'PENDING_CONFIRMATION'; payload: string };

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

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      const { isSignedIn, nextStep } = await signIn({
        username: email,
          password,
        options: { authFlowType: 'USER_PASSWORD_AUTH' },
        });

      if (isSignedIn) {
        const { userId, username } = await getCurrentUser();
        dispatch({ type: 'AUTH_SUCCESS', payload: { userId, username } });
        logger.info('Login successful', { userId }, 'AUTH');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        dispatch({ type: 'PENDING_CONFIRMATION', payload: email });
        throw new Error('Debes confirmar tu cuenta. Revisa tu correo.');
      } else {
        logger.info('🌐 Using real API registration service', { email: userData.email }, 'AUTH');
        response = await apiService.post<{ user: User; tokens: AuthToken }>('/auth/register', userData);
      }
      
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
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    logger.info('Datos del registro, ', { email, password });
    try {
      const response = await signUp({
        username: email,
        password,
        options: { userAttributes: { email, preferred_username: email } },
      });
      
      logger.info(`response from sign up: ${JSON.stringify(response, null, 2)}`);
      
      const { nextStep } = response;

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        dispatch({ type: 'PENDING_CONFIRMATION', payload: email });
        logger.info('Sign-up pending confirmation', { email }, 'AUTH');
      } else {
        // Auto-confirmed (unlikely with email login but handle it)
        const { userId, username } = await getCurrentUser();
        dispatch({ type: 'AUTH_SUCCESS', payload: { userId, username } });
      }
    } catch (error: any) {
      const msg = mapAmplifyError(error);
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw new Error(msg);
    }
  }, []);

  const confirmRegistration = useCallback(async (email: string, code: string) => {
    try {
      dispatch({ type: 'AUTH_LOADING', payload: true });
      const { isSignUpComplete } = await confirmSignUp({ username: email, confirmationCode: code });
      
      if (isSignUpComplete) {
        // After confirmation the user still needs to sign in
        dispatch({ type: 'AUTH_LOADING', payload: false });
        logger.info('Confirmation successful', { email }, 'AUTH');
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: 'Confirmación incompleta' });
        throw new Error('Confirmación incompleta');
    }
    } catch (error: any) {
      const msg = mapAmplifyError(error);
      dispatch({ type: 'AUTH_ERROR', payload: msg });
      throw new Error(msg);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, confirmRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapAmplifyError(error: any): string {
  const code = error?.name || error?.code || '';
  const message = error?.message || '';

  if (code === 'UserNotFoundException' || code === 'NotAuthorizedException') {
    return 'Correo o contraseña incorrectos';
  }
  if (code === 'UserNotConfirmedException') {
    return 'Debes confirmar tu cuenta. Revisa tu correo.';
  }
  if (code === 'UsernameExistsException') {
    return 'Ya existe una cuenta con ese correo electrónico';
  }
  if (code === 'CodeMismatchException') {
    return 'Código de verificación incorrecto';
  }
  if (code === 'ExpiredCodeException') {
    return 'El código ha expirado. Solicita uno nuevo.';
  }
  if (code === 'LimitExceededException') {
    return 'Demasiados intentos. Espera un momento.';
  }
  if (message) return message;
  return 'Ocurrió un error inesperado';
}
