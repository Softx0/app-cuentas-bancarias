/**
 * Banking Application Validator Utilities
 * 
 * This file contains essential validation functions for the banking application.
 * Focused on common validation patterns with clean architecture principles.
 * Unused functions have been removed to reduce bundle size.
 * 
 * @description Essential validation utilities - unused functions removed
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

// ===========================
// CONSTANTS
// ===========================

/**
 * Common regex patterns for validation
 * @constant {Object}
 */
const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  NUMBERS_ONLY: /^\d+$/,
  PHONE_CLEANUP: /\D/g
};

// ===========================
// VALIDATION FUNCTIONS
// ===========================

/**
 * Validates if a string is a valid URL
 * 
 * @param {string} url - URL string to validate
 * @returns {boolean} True if valid URL, false otherwise
 * @example
 * validURL("https://example.com"); // true
 * validURL("invalid-url"); // false
 */
export const validURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    return VALIDATION_PATTERNS.URL.test(url.trim());
  } catch {
    return false;
  }
};

/**
 * Validates email format using RFC 5322 compliant pattern
 * 
 * @param {string} email - Email string to validate
 * @returns {boolean} True if valid email format, false otherwise
 * @example
 * validateEmail("user@example.com"); // true
 * validateEmail("invalid.email"); // false
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const cleanEmail = email.replace(/\s/g, '').trim();
  
  if (cleanEmail.length === 0) {
    return false;
  }
  
  try {
    return VALIDATION_PATTERNS.EMAIL.test(cleanEmail);
  } catch {
    return false;
  }
};

/**
 * Validates if a value is a valid Date object
 * 
 * @param {any} date - Date value to validate
 * @returns {boolean} True if valid Date, false otherwise
 * @example
 * isValidDate(new Date()); // true
 * isValidDate("invalid"); // false
 */
export const isValidDate = (date) => {
  try {
    return date instanceof Date && !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Cleans and formats phone number (removes non-digits, limits to 10 digits)
 * 
 * @param {string|number} phone - Phone number to clean
 * @returns {string} Cleaned phone number (max 10 digits)
 * @example
 * getCleanPhone("(809) 123-4567"); // "8091234567"
 * getCleanPhone("1-809-123-4567"); // "8091234567"
 */
export const getCleanPhone = (phone) => {
  if (!phone) {
    return '';
  }
  
  const phoneString = phone.toString();
  let cleanedPhone = phoneString.replace(VALIDATION_PATTERNS.PHONE_CLEANUP, '');
  
  // Limit to 10 digits (take last 10 if longer)
  if (cleanedPhone.length > 10) {
    cleanedPhone = cleanedPhone.slice(-10);
  }
  
  return cleanedPhone;
};

/**
 * Validates if a phone number has a valid format (10 digits)
 * 
 * @param {string|number} phone - Phone number to validate
 * @returns {boolean} True if valid phone format, false otherwise
 * @example
 * isValidPhone("8091234567"); // true
 * isValidPhone("123"); // false
 */
export const isValidPhone = (phone) => {
  const cleanedPhone = getCleanPhone(phone);
  return cleanedPhone.length === 10 && VALIDATION_PATTERNS.NUMBERS_ONLY.test(cleanedPhone);
};

// ===========================
// EXPORTS
// ===========================

/**
 * Clean, minimal validation utilities export
 * Only includes essential validation functions
 */
export default {
  validURL,
  validateEmail,
  isValidDate,
  getCleanPhone,
  isValidPhone,
  // Export patterns for advanced usage
  VALIDATION_PATTERNS
};

