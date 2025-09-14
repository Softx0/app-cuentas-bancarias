/**
 * Stack Routes Configuration - Banking Application
 * 
 * Centralized configuration for stack navigation routes.
 * Provides easy management of all additional screens beyond tab navigation.
 * 
 * @description Stack navigation route configuration
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

// Import types
import { StackRouteConfig } from '../../../types/navigation';

// Import theme
import Colors from '../../../themes/Colors';


// Import banking screens
import { LoginScreen, RegisterScreen } from '../screens/auth';
import {
  AccountDetailScreen,
  AccountListScreen,
  BalanceInquiryScreen,
  TransactionHistoryScreen,
  TransferResultScreen,
  TransferScreen
} from '../screens/banking';

/**
 * Stack Routes Configuration Array
 * 
 * Centralized configuration for all stack navigation routes.
 * Organized by feature groups for better maintainability.
 * Easy to add, remove, or modify additional screens.
 */
const STACK_ROUTES: StackRouteConfig[] = [
  // Authentication Screens
  {
    name: 'Login',
    component: LoginScreen,
    options: {
      title: 'Iniciar Sesión',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'Register',
    component: RegisterScreen,
    options: {
      title: 'Crear Cuenta',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },

  // Banking Feature Screens
  {
    name: 'AccountList',
    component: AccountListScreen,
    options: {
      title: 'Mis Cuentas',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'AccountDetail',
    component: AccountDetailScreen,
    options: {
      title: 'Detalle de Cuenta',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'TransactionHistory',
    component: TransactionHistoryScreen,
    options: {
      title: 'Historial de Transacciones',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'Transfer',
    component: TransferScreen,
    options: {
      title: 'Transferir Dinero',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'TransferResult',
    component: TransferResultScreen,
    options: {
      title: 'Resultado de Transferencia',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },
  {
    name: 'BalanceInquiry',
    component: BalanceInquiryScreen,
    options: {
      title: 'Consulta de Saldo',
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.primary[400],
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerTitleAlign: 'center',
      headerBackTitle: 'Atrás',
      gestureEnabled: true,
    },
  },


];

/**
 * Stack Navigator Options
 * 
 * Global options for the stack navigator styling and behavior.
 */
export const STACK_NAVIGATOR_OPTIONS = {
  screenOptions: {
    // Default header styling
    headerStyle: {
      backgroundColor: Colors.primary[300],
    },
    headerTintColor: Colors.white,
    headerTitleStyle: {
      fontWeight: 'bold' as const,
      fontSize: 18,
    },
    headerTitleAlign: 'center' as const,
    headerBackTitle: 'Back',
    
    // Gesture handling
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    
    // Animation configuration
    animationEnabled: true,
    animationTypeForReplace: 'push' as const,
    
    // Card styling
    cardStyle: {
      backgroundColor: Colors.background,
    },
  },
  
  // Initial route name
  initialRouteName: 'TabMenu' as const,
};

/**
 * Helper function to get stack route by name
 */
export const getStackRouteByName = (name: string): StackRouteConfig | undefined => {
  return STACK_ROUTES.find(route => route.name === name);
};

/**
 * Helper function to get all stack route names
 */
export const getStackRouteNames = (): string[] => {
  return STACK_ROUTES.map(route => route.name);
};

/**
 * Helper function to get routes by category
 */
export const getRoutesByCategory = () => {
  return {
    demo: STACK_ROUTES.filter(route => 
      route.name.includes('Component') || route.name.includes('Demo')
    ),
    examples: STACK_ROUTES.filter(route => 
      route.name.includes('Example')
    ),
    banking: STACK_ROUTES.filter(route => 
      !route.name.includes('Component') && 
      !route.name.includes('Demo') && 
      !route.name.includes('Example')
    ),
  };
};

/**
 * Log stack routes for debugging
 */
console.log('📚 [StackRoutes] Configured stack routes:', {
  routes: getStackRouteNames(),
  count: STACK_ROUTES.length,
  categories: Object.keys(getRoutesByCategory()).map(category => ({
    category,
    count: getRoutesByCategory()[category as keyof ReturnType<typeof getRoutesByCategory>].length,
  })),
});

export default STACK_ROUTES;
