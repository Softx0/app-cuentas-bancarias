/**
 * Banking Application Themes Index
 * 
 * Central export file for all theme-related resources.
 * Provides easy access to Colors, Metrics, and Fonts.
 * 
 * @description Theme system barrel export
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import Colors from './Colors';
import Fonts, { FontFamily, FontSize, FontWeight } from './Fonts';
import Metrics from './Metrics';

// ===========================
// THEME BUNDLE
// ===========================

/**
 * Complete themes object for legacy compatibility
 * Some components import themes directly
 */
const themes = {
  Colors,
  Metrics,
  Fonts,
  FontSize,
  FontWeight,
  FontFamily
};

// ===========================
// EXPORTS
// ===========================

// Default export for legacy compatibility
export default themes;

// Named exports for modern usage
export {
  Colors, FontFamily, Fonts,
  FontSize,
  FontWeight, Metrics
};

