/**
 * SvgIcon - Universal SVG component for consistent icon usage
 * 
 * This component provides a standardized way to use SVG icons throughout the app
 * with consistent sizing, coloring, and accessibility features.
 */
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SvgIconProps {
  /** SVG component imported from assets */
  SvgComponent: React.FC<SvgProps>;
  /** Icon size in pixels */
  size?: number;
  /** Icon width (overrides size if provided) */
  width?: number;
  /** Icon height (overrides size if provided) */
  height?: number;
  /** Icon color */
  color?: string;
  /** Container styles */
  containerStyle?: ViewStyle;
  /** Additional props to pass to the SVG component */
  svgProps?: Partial<SvgProps>;
  /** Test ID for accessibility testing */
  testID?: string;
}

/**
 * Universal SVG Icon Component
 * 
 * @example
 * // Basic usage
 * import CalendarIcon from '../../assets/icons/calendar.svg';
 * <SvgIcon SvgComponent={CalendarIcon} size={24} color="#007AFF" />
 * 
 * @example
 * // Custom dimensions
 * import ArrowIcon from '../../assets/icons/arrow-left.svg';
 * <SvgIcon 
 *   SvgComponent={ArrowIcon} 
 *   width={32} 
 *   height={16} 
 *   color="#666"
 *   containerStyle={{ marginRight: 8 }}
 * />
 */
export const SvgIcon: React.FC<SvgIconProps> = ({
  SvgComponent,
  size = 24,
  width,
  height,
  color,
  containerStyle,
  svgProps,
  testID,
}) => {
  // Memoized dimensions
  const dimensions = useMemo(() => ({
    width: width || size,
    height: height || size,
  }), [width, height, size]);

  // Memoized SVG props
  const computedSvgProps = useMemo(() => ({
    width: dimensions.width,
    height: dimensions.height,
    ...(color && { color, fill: color }),
    ...svgProps,
  }), [dimensions, color, svgProps]);

  return (
    <View 
      style={[styles.container, containerStyle]} 
      testID={testID}
      accessible={true}
      accessibilityRole="image"
    >
      <SvgComponent {...computedSvgProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SvgIcon;
