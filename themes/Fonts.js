/**
 * Banking Application Font System
 * 
 * This file contains the font sizes and typography configuration for the banking application.
 * Provides consistent font sizing across all components.
 * 
 * @description Font system with consistent sizing
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

// ===========================
// FONT SIZES
// ===========================

/**
 * Standard font sizes used throughout the application
 * Based on common design system practices
 */
export const FontSize = {
  // Main text sizes
  small: 12,
  subtitle: 14,
  medium: 16,
  large: 18,
  
  // Title sizes
  title: 20,
  heading: 24,
  display: 32,
  
  // Specific use cases
  caption: 10,
  body: 14,
  button: 16,
  
  // Legacy aliases for compatibility
  tiny: 10,
  regular: 14,
  big: 18,
  huge: 24
};

// ===========================
// FONT WEIGHTS
// ===========================

/**
 * Standard font weights
 */
export const FontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800"
};

// ===========================
// FONT FAMILIES
// ===========================

/**
 * Font families used in the application
 */
export const FontFamily = {
  primary: "SF Pro",
  secondary: "Roboto",
  system: "System"
};

// ===========================
// EXPORTS
// ===========================

export default {
  FontSize,
  FontWeight,
  FontFamily
};
