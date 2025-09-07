/**
 * Snackbar Example Usage Component
 * 
 * Demonstrates all the different ways to use the refactored Snackbar component
 * without defaultProps and with modern React patterns.
 */
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AlertCircleRed from '../../assets/icons/alert-circle-red.svg';
import CheckCircleSuccess from '../../assets/icons/check-circle-success.svg';
import { Snackbar } from '../snackbar/Snackbar';
import { SvgIcon } from '../ui/SvgIcon';

import Colors from '../../themes/Colors';
import { AlertCircle, CheckCircle, IconColors, IconSizes } from '../../utils/SvgIcons';

interface ExampleSectionProps {
  title: string;
  children: React.ReactNode;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SnackbarExampleUsage: React.FC = () => {
  // State for different snackbar examples
  const [showBasic, setShowBasic] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showWithAction, setShowWithAction] = useState(false);
  const [showNoIcon, setShowNoIcon] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Snackbar Examples</Text>
      
      <ExampleSection title="Basic Snackbar (Default)">
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowBasic(true)}
        >
          <Text style={styles.buttonText}>Show Basic Snackbar</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showBasic}
          message="¡Operación completada exitosamente!"
          duration={3000}
        />
      </ExampleSection>

      <ExampleSection title="Success Snackbar with Custom Icon">
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: IconColors.success }]} 
          onPress={() => setShowSuccess(true)}
        >
          <Text style={styles.buttonText}>Show Success</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showSuccess}
          message="¡Datos guardados correctamente!"
          duration={4000}
          backgroundColorSnack={IconColors.success}
          iconComponent={
            <SvgIcon 
              SvgComponent={CheckCircle} 
              size={IconSizes.md} 
              color="white" 
            />
          }
        />
      </ExampleSection>

      <ExampleSection title="Error Snackbar">
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: IconColors.danger }]} 
          onPress={() => setShowError(true)}
        >
          <Text style={styles.buttonText}>Show Error</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showError}
          message="Error al procesar la solicitud. Intenta nuevamente."
          duration={5000}
          backgroundColorSnack={IconColors.danger}
          iconComponent={<AlertCircleRed width={20} height={20} />}
        />
      </ExampleSection>

      <ExampleSection title="Snackbar with Action Button">
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: IconColors.info }]} 
          onPress={() => setShowWithAction(true)}
        >
          <Text style={styles.buttonText}>Show with Action</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showWithAction}
          message="Conexión perdida. Verifica tu red."
          actionText="Reintentar"
          onActionPress={() => {
            console.log("Retry action pressed!");
            setShowWithAction(false);
          }}
          duration={0} // Infinite duration
          backgroundColorSnack={IconColors.info}
          iconComponent={
            <SvgIcon 
              SvgComponent={AlertCircle} 
              size={IconSizes.md} 
              color="white" 
            />
          }
        />
      </ExampleSection>

      <ExampleSection title="Custom Styled Snackbar">
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#9C27B0' }]} 
          onPress={() => setShowCustom(true)}
        >
          <Text style={styles.buttonText}>Show Custom</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showCustom}
          message="Notificación personalizada con estilos únicos"
          duration={4000}
          backgroundColorSnack="#9C27B0"
          iconComponent={<CheckCircleSuccess width={24} height={24} />}
          messageTextStyle={styles.customMessageText}
          containerStyle={styles.customContainer}
          snackBarContainerStyle={styles.customSnackbarContainer}
        />
      </ExampleSection>

      <ExampleSection title="Snackbar without Icon">
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#607D8B' }]} 
          onPress={() => setShowNoIcon(true)}
        >
          <Text style={styles.buttonText}>Show No Icon</Text>
        </TouchableOpacity>
        
        <Snackbar
          visible={showNoIcon}
          message="Mensaje simple sin icono"
          duration={3000}
          showDefaultIcon={false}
          backgroundColorSnack="#607D8B"
        />
      </ExampleSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✨ Snackbar refactorizado sin defaultProps, con optimizaciones y logs! 
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary || '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary || '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  customContainer: {
    paddingHorizontal: 20,
  },
  customSnackbarContainer: {
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  customMessageText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary || '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SnackbarExampleUsage;
