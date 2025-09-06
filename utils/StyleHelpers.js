/**
 * Banking Application Style Helpers
 * 
 * This file contains essential styling utilities for responsive design
 * and platform-specific adaptations. Optimized for React Native applications.
 * 
 * @description Responsive design utilities with clean architecture
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import { Dimensions, Platform } from "react-native";

// ===========================
// CONSTANTS
// ===========================

/**
 * Platform detection - widely used throughout components
 * @constant {boolean}
 */
export const IS_IOS = Platform.OS === "ios";

/**
 * Viewport dimensions - used for responsive layouts
 * @constant {Object}
 */
export const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

/**
 * Device size classification
 * @constant {boolean}
 */
export const isSmallDevice = viewportWidth <= 365;

// ===========================
// RESPONSIVE DESIGN UTILITIES
// ===========================

/**
 * Gets screen dimensions for advanced calculations
 * @constant {Object}
 */
export const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

// ===========================
// EXPORTS
// ===========================

/**
 * Clean, optimized style helpers export
 * Only includes utilities actively used in components
 */
export default {
  // Platform detection
  IS_IOS,
  
  // Viewport dimensions
  viewportWidth,
  viewportHeight,
  
  // Device classification
  isSmallDevice,
  
  // Screen dimensions
  screenWidth,
  screenHeight
};
