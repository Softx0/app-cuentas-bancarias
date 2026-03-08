/**
 * Profile Screen - Banking Application
 * 
 * User profile management screen with account details, preferences, and settings.
 * Implements clean architecture and performance optimization patterns.
 * 
 * @description User profile and account management
 * @version 3.0.0
 * @author Eduardo Valenzuela
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import types
import { ProfileScreenProps } from '../../../../types/navigation';

// Import theme
import Colors from '../../../../themes/Colors';

// Import contexts
import { useAuth } from '../../../context/auth/AuthContext';

// Import navigation service
import NavigationService from '../../../infrastructure/services/NavigationService';

/**
 * Profile Screen Component
 * 
 * Displays user profile information, account preferences,
 * security settings, and quick access to related features.
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  console.log(' [ProfileScreen] Component rendered');

  // Auth context
  const { logout } = useAuth();

  // Local state for toggles - In real app, this would be in global state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Mock user data - In real app, this would come from state management
  const userData = useMemo(() => ({
    name: 'Eduardo Valenzuela',
    email: 'eduardo.valenzuela@banking.com',
    phone: '+1 (555) 123-4567',
    accountSince: '2020',
    avatar: 'https://via.placeholder.com/100x100.png?text=EV',
    accountType: 'Premium',
    lastLogin: 'Today at 9:30 AM',
  }), []);


  const handleGoBack = useCallback(() => {
    console.log(' [ProfileScreen] Going back');
    NavigationService.goBack();
  }, []);

  // Profile action handlers
  const handleEditProfile = useCallback(() => {
    console.log(' [ProfileScreen] Edit Profile action triggered');
    Alert.alert(
      'Editar Perfil',
      'Esta funcionalidad no está disponible en este momento.',
      [{ text: 'Entendido' }]
    );
  }, []);

  const handleSecuritySettings = useCallback(() => {
    console.log(' [ProfileScreen] Security Settings action triggered');
    Alert.alert(
      'Configuración de Seguridad',
      'Esta funcionalidad no está disponible en este momento.',
      [{ text: 'Entendido' }]
    );
  }, []);

  const handleSupport = useCallback(() => {
    console.log(' [ProfileScreen] Support action triggered');
    Alert.alert(
      'Soporte',
      'Esta funcionalidad no está disponible en este momento.',
      [{ text: 'Entendido' }]
    );
  }, []);

  const handleLogout = useCallback(async () => {
    console.log(' [ProfileScreen] Logout action triggered');
    
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(' [ProfileScreen] Performing logout...');
              await logout();
              console.log(' [ProfileScreen] Logout successful');
              // Navigation will be handled by the auth state change
            } catch (error) {
              console.error(' [ProfileScreen] Logout failed:', error);
              Alert.alert(
                'Error',
                'No se pudo cerrar la sesión. Inténtalo de nuevo.',
                [{ text: 'Entendido' }]
              );
            }
          },
        },
      ]
    );
  }, [logout]);

  // Toggle handlers
  const handleNotificationsToggle = useCallback((value: boolean) => {
    console.log(' [ProfileScreen] Notifications toggle:', value);
    setNotificationsEnabled(value);
    
    if (value) {
      Alert.alert(
        'Notificaciones',
        'La configuración de notificaciones no está disponible en este momento.',
        [{ text: 'Entendido' }]
      );
    }
  }, []);

  const handleBiometricsToggle = useCallback((value: boolean) => {
    console.log(' [ProfileScreen] Biometrics toggle:', value);
    setBiometricsEnabled(value);
    
    if (value) {
      Alert.alert(
        'Autenticación Biométrica',
        'La autenticación biométrica no está disponible en este momento.',
        [{ text: 'Entendido' }]
      );
    }
  }, []);

  const handleDarkModeToggle = useCallback((value: boolean) => {
    console.log(' [ProfileScreen] Dark mode toggle:', value);
    setDarkModeEnabled(value);
    
    if (value) {
      Alert.alert(
        'Modo Oscuro',
        'La configuración de tema oscuro no está disponible en este momento.',
        [{ text: 'Entendido' }]
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatar}
              defaultSource={{ uri: 'https://via.placeholder.com/100x100.png?text=EV' }}
            />
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <Text style={styles.accountType}>Cuenta {userData.accountType}</Text>
            <Text style={styles.memberSince}>Cliente desde {userData.accountSince}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Número de Teléfono</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Último Acceso</Text>
            <Text style={styles.infoValue}>{userData.lastLogin}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Notificaciones Push</Text>
              <Text style={styles.preferenceDescription}>Recibir alertas y actualizaciones</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
              thumbColor={notificationsEnabled ? Colors.primary[300] : Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Autenticación Biométrica</Text>
              <Text style={styles.preferenceDescription}>Usar huella digital o reconocimiento facial</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleBiometricsToggle}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
              thumbColor={biometricsEnabled ? Colors.primary[300] : Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Modo Oscuro</Text>
              <Text style={styles.preferenceDescription}>Usar tema oscuro</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
              thumbColor={darkModeEnabled ? Colors.primary[300] : Colors.neutral[400]}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSecuritySettings}>
            <Text style={styles.actionIcon}>🔒</Text>
            <Text style={styles.actionText}>Configuración de Seguridad</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSupport}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Contactar Soporte</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
  scrollContentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary[300],
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.neutral[200],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  accountType: {
    fontSize: 12,
    color: Colors.primary[300],
    fontWeight: '600',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  editButton: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: Colors.primary[300],
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  infoItem: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  preferenceItem: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  actionArrow: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  devSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  devButton: {
    backgroundColor: Colors.primary[100],
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  devButtonText: {
    color: Colors.primary[300],
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: Colors.feedback.error[100],
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: Colors.feedback.error[300],
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
