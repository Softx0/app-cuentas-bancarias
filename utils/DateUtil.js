/**
 * Banking Application Date Utilities
 * 
 * This file contains essential date manipulation functions for the banking application.
 * Focused on performance and clean architecture principles.
 * Only includes functions that are actively used in the application.
 * 
 * @description Optimized date utilities with clean architecture
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

import moment from "moment";

// ===========================
// CONSTANTS
// ===========================

/**
 * Standard date formats used throughout the application
 * @constant {Object}
 */
export const DATE_FORMATS = {
  MIDLEDASH_DMY: "DD-MM-YYYY",
  MIDDLEDASH_YMD: "YYYY-MM-DD", 
  MIDDLEDASH_YMDH: "YYYY-MM-DDTHH:mm:ss",
  SLASH_DMY: "DD/MM/YYYY"
};

// ===========================
// VALIDATION FUNCTIONS
// ===========================

/**
 * Verifies if a value is a valid Date instance
 * 
 * @param {any} value - The value to verify
 * @returns {boolean} True if it's a Date instance, false otherwise
 * @example
 * isDate(new Date()); // true
 * isDate("2023-01-01"); // false
 */
export const isDate = (value) => {
  try {
    return value instanceof Date && !isNaN(value.getTime());
  } catch {
    return false;
  }
};

// ===========================
// FORMATTING FUNCTIONS  
// ===========================

/**
 * Formats a date to YYYY-MM-DD format
 * 
 * @param {Date|string|number} date - The date to format
 * @returns {string} Date formatted as "YYYY-MM-DD"
 * @throws {Error} If date is invalid
 * @example
 * formatDate(new Date()); // "2023-12-25"
 */
export const formatDate = (date) => {
  if (!date) {
    throw new Error('Date parameter is required');
  }
  
  const momentDate = moment(date);
  if (!momentDate.isValid()) {
    throw new Error('Invalid date provided');
  }
  
  return momentDate.format(DATE_FORMATS.MIDDLEDASH_YMD);
};

/**
 * Formats a date according to specified format
 * 
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The desired format (e.g., "DD/MM/YYYY")
 * @returns {string} Date formatted according to specified format
 * @throws {Error} If date is invalid or format is not provided
 * @example  
 * formatDateByFormat(new Date(), "DD/MM/YYYY"); // "25/12/2023"
 */
export const formatDateByFormat = (date, format) => {
  if (!date) {
    throw new Error('Date parameter is required');
  }
  
  if (!format) {
    throw new Error('Format parameter is required');
  }
  
  const momentDate = moment(date);
  if (!momentDate.isValid()) {
    throw new Error('Invalid date provided');
  }
  
  return momentDate.format(format);
};

// ===========================
// DATE CALCULATION FUNCTIONS
// ===========================

/**
 * Gets today's date with optional formatting
 * 
 * @param {string} [format] - Optional format string (uses moment.js format)
 * @returns {moment.Moment|string} Moment object or formatted string if format provided
 * @example
 * obtenerFechaHoy(); // moment object for today
 * obtenerFechaHoy("YYYY-MM-DD"); // "2023-12-25"
 */
export const obtenerFechaHoy = (format) => {
  const today = moment();
  return format ? today.format(format) : today;
};

/**
 * Gets the date from one year ago with optional formatting
 * 
 * @param {string} [format] - Optional format string (uses moment.js format)
 * @returns {moment.Moment|string} Moment object or formatted string if format provided
 * @example
 * unAnoHaciaAtras(); // moment object for one year ago
 * unAnoHaciaAtras("YYYY-MM-DD"); // "2022-12-25"
 */
export const unAnoHaciaAtras = (format) => {
  const oneYearAgo = moment().subtract(1, 'year');
  return format ? oneYearAgo.format(format) : oneYearAgo;
};

// ===========================
// EXPORTS
// ===========================

/**
 * Clean, optimized date utilities export
 * Only includes functions actively used in the banking application
 */
export default {
  // Constants
  DATE_FORMATS,
  
  // Validation functions
  isDate,
  
  // Formatting functions
  formatDate,
  formatDateByFormat,
  
  // Date calculation functions
  obtenerFechaHoy,
  unAnoHaciaAtras
};
