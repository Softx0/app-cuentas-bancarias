/**
 * @fileoverview Root provider component that combines all context providers
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import React, { memo } from 'react';

import { AppProvider } from '../app/AppContext';
import { AuthProvider } from '../auth/AuthContext';
import { logger } from '../../infrastructure/utils/logger';

/**
 * Root provider props interface
 */
interface RootProviderProps {
  children: React.ReactNode;
}

/**
 * Root provider component that wraps the app with all necessary context providers
 * @param props Provider props
 * @returns RootProvider component
 */
const RootProvider: React.FC<RootProviderProps> = memo(({ children }) => {
  logger.debug('RootProvider rendering', undefined, 'PROVIDER');

  return (
    <AppProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AppProvider>
  );
});

RootProvider.displayName = 'RootProvider';

export { RootProvider };
