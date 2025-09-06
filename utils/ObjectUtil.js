/**
 * Banking Application Object Utilities
 * 
 * This file contains minimal object manipulation functions.
 * Optimized for performance and clean architecture.
 * 
 * @description Essential object utilities - unused functions removed
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

// ===========================
// VALIDATION FUNCTIONS
// ===========================

/**
 * Checks if a value is a plain object (not array, null, etc.)
 * 
 * @param {any} value - Value to check
 * @returns {boolean} True if it's a plain object
 * @example
 * isObject({}); // true
 * isObject([]); // false
 * isObject(null); // false
 */
export const isObject = (value) => {
  return Boolean(value) && 
         typeof value === 'object' && 
         value.constructor === Object;
};

/**
 * Ensures the input is a valid object, returns empty object if not
 * 
 * @param {any} obj - Object to clean/validate
 * @returns {Object} Valid object or empty object
 * @example
 * cleanObject({a: 1}); // {a: 1}
 * cleanObject(null); // {}
 * cleanObject("invalid"); // {}
 */
export const cleanObject = (obj) => {
  return isObject(obj) ? obj : {};
};

/**
 * Safely extracts a value from an object with a default key
 * 
 * @param {Object} obj - Source object
 * @param {string} key - Key to extract (default: "Value")
 * @returns {any} Extracted value or undefined
 * @example
 * safeValExtraction({Value: 42}); // 42
 * safeValExtraction({data: 100}, "data"); // 100
 * safeValExtraction(null); // undefined
 */
export const safeValExtraction = (obj, key = "Value") => {
  return cleanObject(obj)[key];
};

/**
 * Checks if an object is empty (has no keys)
 * 
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 * @example
 * isObjectEmpty({}); // true
 * isObjectEmpty({a: 1}); // false
 * isObjectEmpty(null); // true
 */
export const isObjectEmpty = (obj) => {
  return Object.keys(cleanObject(obj)).length === 0;
};

// ===========================
// EXPORTS
// ===========================

/**
 * Clean, minimal object utilities export
 * Only includes essential object manipulation functions
 */
export default {
  isObject,
  cleanObject,
  safeValExtraction,
  isObjectEmpty
};
