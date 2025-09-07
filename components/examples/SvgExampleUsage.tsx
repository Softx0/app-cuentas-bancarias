/**
 * SVG Example Usage Component
 * 
 * Demonstrates all the different ways to use SVG icons in the application
 * This serves as both documentation and testing for the SVG system.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Method 1: Direct SVG imports
import CalendarIcon from '../../assets/icons/calendar.svg';
import CheckIcon from '../../assets/icons/check-circle.svg';
import SearchIcon from '../../assets/icons/feather-search.svg';

// Method 2: Using SvgIcon utility
import { SvgIcon } from '../ui/SvgIcon';

// Method 3: Using pre-imported icons from utils
import {
    Calendar,
    CheckCircle,
    IconColors,
    IconSizes,
    Search,
    getIconByName
} from '../../utils/SvgIcons';

import Colors from '../../themes/Colors';

interface ExampleSectionProps {
  title: string;
  children: React.ReactNode;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const SvgExampleUsage: React.FC = () => {
  // Dynamic icon loading example
  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = getIconByName(name);
    if (!IconComponent) return null;
    
    return (
      <SvgIcon 
        SvgComponent={IconComponent} 
        size={IconSizes.lg} 
        color={IconColors.primary}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>SVG Icons Usage Examples</Text>
      
      <ExampleSection title="Method 1: Direct SVG Imports">
        <View style={styles.iconRow}>
          <CalendarIcon width={24} height={24} color={Colors.primary} />
          <SearchIcon width={24} height={24} color={Colors.textSecondary} />
          <CheckIcon width={24} height={24} color={IconColors.success} />
        </View>
      </ExampleSection>

      <ExampleSection title="Method 2: Using SvgIcon Utility">
        <View style={styles.iconRow}>
          <SvgIcon 
            SvgComponent={CalendarIcon} 
            size={IconSizes.lg} 
            color={Colors.primary}
            testID="calendar-icon"
          />
          <SvgIcon 
            SvgComponent={SearchIcon} 
            size={IconSizes.lg} 
            color={Colors.textSecondary}
          />
          <SvgIcon 
            SvgComponent={CheckIcon} 
            size={IconSizes.lg} 
            color={IconColors.success}
          />
        </View>
      </ExampleSection>

      <ExampleSection title="Method 3: Pre-imported from Utils">
        <View style={styles.iconRow}>
          <SvgIcon 
            SvgComponent={Calendar} 
            size={IconSizes.lg} 
            color={Colors.primary}
          />
          <SvgIcon 
            SvgComponent={Search} 
            size={IconSizes.lg} 
            color={Colors.textSecondary}
          />
          <SvgIcon 
            SvgComponent={CheckCircle} 
            size={IconSizes.lg} 
            color={IconColors.success}
          />
        </View>
      </ExampleSection>

      <ExampleSection title="Different Sizes">
        <View style={styles.iconRow}>
          <SvgIcon SvgComponent={Calendar} size={IconSizes.xs} color={Colors.primary} />
          <SvgIcon SvgComponent={Calendar} size={IconSizes.sm} color={Colors.primary} />
          <SvgIcon SvgComponent={Calendar} size={IconSizes.md} color={Colors.primary} />
          <SvgIcon SvgComponent={Calendar} size={IconSizes.lg} color={Colors.primary} />
          <SvgIcon SvgComponent={Calendar} size={IconSizes.xl} color={Colors.primary} />
          <SvgIcon SvgComponent={Calendar} size={IconSizes.xxl} color={Colors.primary} />
        </View>
      </ExampleSection>

      <ExampleSection title="Different Colors">
        <View style={styles.iconRow}>
          <SvgIcon SvgComponent={CheckCircle} size={IconSizes.lg} color={IconColors.primary} />
          <SvgIcon SvgComponent={CheckCircle} size={IconSizes.lg} color={IconColors.success} />
          <SvgIcon SvgComponent={CheckCircle} size={IconSizes.lg} color={IconColors.warning} />
          <SvgIcon SvgComponent={CheckCircle} size={IconSizes.lg} color={IconColors.danger} />
          <SvgIcon SvgComponent={CheckCircle} size={IconSizes.lg} color={IconColors.info} />
        </View>
      </ExampleSection>

      <ExampleSection title="Dynamic Icon Loading">
        <View style={styles.iconRow}>
          <DynamicIcon name="calendar" />
          <DynamicIcon name="search" />
          <DynamicIcon name="check-circle" />
          <DynamicIcon name="home" />
          <DynamicIcon name="user" />
        </View>
      </ExampleSection>

      <ExampleSection title="Custom Styling">
        <View style={styles.iconRow}>
          <View style={styles.customIconContainer}>
            <Calendar width={32} height={32} color={IconColors.white} />
          </View>
          <View style={[styles.customIconContainer, { backgroundColor: IconColors.success }]}>
            <CheckCircle width={32} height={32} color={IconColors.white} />
          </View>
          <View style={[styles.customIconContainer, { backgroundColor: IconColors.danger }]}>
            <Search width={32} height={32} color={IconColors.white} />
          </View>
        </View>
      </ExampleSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All icons are properly typed, cached, and optimized for performance! 🚀
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary || '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
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
  sectionContent: {
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  customIconContainer: {
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary || '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SvgExampleUsage;
