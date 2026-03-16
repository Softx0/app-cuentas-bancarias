
/**
 * Banking Application Color Palette
 * 
 * This file contains the complete color system for the banking application.
 * Colors are organized by purpose and include multiple shades for each color family.
 * 
 * @description Complete color palette including primary, secondary, accent, feedback, and neutral colors
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

const Colors = {
  // 🔵 PRIMARY COLORS - Identity and Trust
  primary: {
    100: "#E6F0FA", // Very light background, hover, soft highlights
    200: "#A3C4E9", // Secondary backgrounds, badges
    300: "#1E5AA8", // Buttons, active icons, featured titles
    400: "#0A3D62", // Main brand color, headers, strong emphasis
  },

  // 🟢 SECONDARY COLORS - Main Actions / Success
  secondary: {
    100: "#E9FAF3", // Very subtle success backgrounds
    200: "#A8E6CF", // Tags, positive action highlights
    300: "#27AE60", // Positive action buttons, confirmations
    400: "#00A896", // Modern variant for quick actions
  },

  // 🟡 ACCENT COLORS - Warnings and Notifications
  accent: {
    warning: {
      100: "#FFF4E0", // Subtle alert backgrounds
      200: "#F9C74F", // Warning icons, soft alerts
      300: "#F8961E", // Active alerts, attention calls
    },
  },

  // FEEDBACK COLORS - System Status
  feedback: {
    // 🔴 Error States
    error: {
      100: "#FDECEA", // Very subtle error background
      200: "#F28B82", // Secondary error messages
      300: "#E63946", // Error text/buttons, critical alerts
    },
    
    // 🟢 Success States
    success: {
      100: "#E6FAF3", // Success background subtle
      200: "#06D6A0", // Success highlights
      300: "#27AE60", // Success confirmation
    },
    
    // 🔵 Info States
    info: {
      100: "#E6F4FA", // Info background subtle
      200: "#90CAF9", // Info highlights
      300: "#118AB2", // Info emphasis
    },
  },

  // ⚪ NEUTRAL COLORS - Text, Backgrounds, Borders
  neutral: {
    100: "#FFFFFF", // Main background
    200: "#F8F9FA", // Secondary backgrounds, cards
    300: "#DEE2E6", // Soft borders, dividers
    400: "#ADB5BD", // Disabled text, placeholders
    500: "#6C757D", // Secondary text
    600: "#495057", // Intermediate text
    700: "#343A40", // Strong main text
    800: "#212529", // Headers, main titles
    900: "#1A1A1A", // Almost black, maximum hierarchy
  },

  // 🎯 LEGACY COMPATIBILITY (for gradual migration)
  legacy: {
    primary: "#009ED4",
    success: "#28a745",
    error: "#FDB062",
    white: "#FFFFFF",
    whiteFB: "#FBFBFB",
  },

  // 🚀 QUICK ACCESS SHORTCUTS - Most commonly used colors
  brand: "#0A3D62",        // Main brand color
  brandLight: "#E6F0FA",   // Light brand variant
  success: "#27AE60",      // Main success color
  error: "#E63946",        // Main error color
  warning: "#F8961E",      // Main warning color
  info: "#118AB2",         // Main info color
  white: "#FFFFFF",        // Pure white
  black: "#1A1A1A",        // Soft black
  textPrimary: "#212529",  // Main text color
  textSecondary: "#6C757D", // Secondary text color
  background: "#F8F9FA",   // Main background
  border: "#DEE2E6",       // Default border color
};

export default Colors;
