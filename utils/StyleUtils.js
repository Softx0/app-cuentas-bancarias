/**
 * Banking Application Style Utils
 * 
 * This file contains font scaling utilities for accessibility and responsive design.
 * Handles different font scale preferences set by users on their devices.
 * 
 * @description Font scaling utilities with clean architecture
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import { PixelRatio } from "react-native";

// ===========================
// CONSTANTS
// ===========================

/**
 * Font scale thresholds for different device configurations
 * @constant {Object}
 */
const FONT_SCALE_THRESHOLDS = {
  SMALL: { max: 1.1, base: 26 },
  MEDIUM_SMALL: { min: 1.11, max: 1.17, base: 23 },
  MEDIUM: { min: 1.2, max: 1.34, base: 21 },
  LARGE: { min: 1.35, max: 1.5, base: 19 },
  EXTRA_LARGE: { min: 1.7, base: 15 }
};

// ===========================
// FONT SCALING FUNCTIONS
// ===========================

/**
 * Calculates font size based on device font scale with accessibility support
 * 
 * This function adapts font sizes based on the user's accessibility settings,
 * ensuring text remains readable across different font scale preferences.
 * 
 * @param {number} bigFontMultiplier - Multiplier for larger font scales
 * @param {number} smallFontMultiplier - Multiplier for smaller font scales
 * @returns {number} Calculated font size
 * @example
 * fontSizeByFontScale(0.8, 0.9); // Returns scaled font size
 */
const fontSizeByFontScale = (bigFontMultiplier, smallFontMultiplier) => {
  const currentFontScale = PixelRatio.getFontScale();
  
  // Validate multipliers
  if (typeof bigFontMultiplier !== 'number' || typeof smallFontMultiplier !== 'number') {
    console.warn('StyleUtils: Invalid multipliers provided, using defaults');
    return 16; // Default font size
  }
  
  // Apply font scale based on thresholds
  if (currentFontScale <= FONT_SCALE_THRESHOLDS.SMALL.max) {
    return FONT_SCALE_THRESHOLDS.SMALL.base * smallFontMultiplier;
  }
  
  if (currentFontScale >= FONT_SCALE_THRESHOLDS.MEDIUM_SMALL.min && 
      currentFontScale <= FONT_SCALE_THRESHOLDS.MEDIUM_SMALL.max) {
    return FONT_SCALE_THRESHOLDS.MEDIUM_SMALL.base * smallFontMultiplier;
  }
  
  if (currentFontScale >= FONT_SCALE_THRESHOLDS.MEDIUM.min && 
      currentFontScale <= FONT_SCALE_THRESHOLDS.MEDIUM.max) {
    return FONT_SCALE_THRESHOLDS.MEDIUM.base * bigFontMultiplier;
  }
  
  if (currentFontScale >= FONT_SCALE_THRESHOLDS.LARGE.min && 
      currentFontScale <= FONT_SCALE_THRESHOLDS.LARGE.max) {
    return FONT_SCALE_THRESHOLDS.LARGE.base * bigFontMultiplier;
  }
  
  if (currentFontScale >= FONT_SCALE_THRESHOLDS.EXTRA_LARGE.min) {
    return FONT_SCALE_THRESHOLDS.EXTRA_LARGE.base * bigFontMultiplier;
  }
  
  // Fallback for unexpected font scale values
  return 16 * smallFontMultiplier;
};

// ===========================
// EXPORTS
// ===========================

/**
 * Clean, optimized style utils export
 * Focused on font scaling functionality
 */
export default { 
  fontSizeByFontScale,
  // Export thresholds for testing/debugging
  FONT_SCALE_THRESHOLDS
};
