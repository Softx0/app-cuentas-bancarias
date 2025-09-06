/**
 * String Utilities and Processing Functions
 * 
 * This module provides essential string manipulation utilities for the banking application.
 * It includes validation, formatting, conversion and sanitization functions optimized 
 * for common use cases in the project.
 * 
 * @description Comprehensive string processing utilities with validation and formatting
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

// ===========================
// CONSTANTS & ENUMS
// ===========================

/**
 * Common error messages for validation
 * @readonly
 * @enum {string}
 */
export const STRING_VALIDATION_MESSAGES = Object.freeze({
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'Favor digitar un email válido',
  INVALID_URL: 'Favor digitar un URL válido',
  INVALID_PHONE: 'Favor digitar un teléfono válido',
  INVALID_RNC: 'Favor digitar un RNC válido',
  INVALID_DOCUMENT: 'Favor digitar un documento válido',
  INVALID_FORMAT: 'Formato inválido'
});

/**
 * Currency symbols and prefixes
 * @readonly
 * @enum {string}
 */
export const CURRENCY_SYMBOLS = Object.freeze({
  DOMINICAN_PESO: 'RD$',
  US_DOLLAR: 'US$',
  GENERIC: '$'
});

/**
 * Regular expressions for common validations
 * @readonly
 * @enum {RegExp}
 */
const REGEX_PATTERNS = Object.freeze({
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  NUMBERS_ONLY: /\D/g,
  LETTERS_ONLY: /[^a-zA-ZñÑáÁéÉíÍóÓúÚ ]/g,
  LETTERS_AND_NUMBERS: /[^a-zA-Z0-9 ]/g,
  NUMBERS_WITH_DECIMAL: /[^0-9.]/g,
  SPECIAL_CHARACTERS: /[!@#$%^&*()áéíóú_+\-=\[\]{};':"\\|,<>\/?]+/g,
  WHITESPACE: /\s/,
  MULTIPLE_SPACES: /\s{2,}/g,
  NON_WORD_CHARACTERS: /\W/g,
  THOUSANDS_SEPARATOR: /\B(?=(\d{3})+(?!\d))/g
});

// ===========================
// CORE CONVERSION FUNCTIONS
// ===========================

/**
 * Safely converts any input to string representation
 * @param {*} input - Input value to convert to string
 * @returns {string} String representation of the input, empty string if falsy
 * @example
 * localToString(null) // ''
 * localToString(123) // '123'
 * localToString('hello') // 'hello'
 */
export const localToString = (input) => {
  console.log('[StringUtil] localToString input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] localToString: Input is falsy, returning empty string');
    return '';
  }
  
  const result = String(input);
  console.log('[StringUtil] localToString result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Checks if a string has meaningful content (not empty or whitespace only)
 * @param {*} input - Input to validate
 * @returns {boolean} True if string has content, false otherwise
 */
export const hasStringContent = (input) => {
  console.log('[StringUtil] hasStringContent input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] hasStringContent: Input is falsy');
    return false;
  }
  
  const stringValue = String(input).trim();
  const hasContent = stringValue.length > 0;
  
  console.log('[StringUtil] hasStringContent result:', JSON.stringify(hasContent, null, 2));
  return hasContent;
};

/**
 * Safely converts string to number with fallback
 * @param {*} input - Input to convert to number
 * @param {number} fallback - Fallback value if conversion fails
 * @returns {number} Converted number or fallback
 */
export const safeStringToNumber = (input, fallback = 0) => {
  console.log('[StringUtil] safeStringToNumber input:', JSON.stringify({ input, fallback }, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] safeStringToNumber: Using fallback for falsy input');
    return fallback;
  }
  
  // Clean the input to keep only numbers and decimal points
  const cleanInput = String(input).replace(REGEX_PATTERNS.NUMBERS_WITH_DECIMAL, '');
  const parsedNumber = parseFloat(cleanInput);
  
  if (isNaN(parsedNumber)) {
    console.log('[StringUtil] safeStringToNumber: NaN result, using fallback');
    return fallback;
  }
  
  console.log('[StringUtil] safeStringToNumber result:', JSON.stringify(parsedNumber, null, 2));
  return parsedNumber;
};

// ===========================
// STRING CLEANING & SANITIZATION
// ===========================

/**
 * Cleans and trims string input
 * @param {*} input - Input to clean
 * @returns {string} Cleaned and trimmed string
 */
export const cleanString = (input) => {
  console.log('[StringUtil] cleanString input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] cleanString: Empty input, returning empty string');
    return '';
  }
  
  const result = String(input).trim();
  console.log('[StringUtil] cleanString result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Removes all non-numeric characters from string
 * @param {*} input - Input string to clean
 * @returns {string} String with only numbers
 */
export const extractNumbers = (input) => {
  console.log('[StringUtil] extractNumbers input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] extractNumbers: Empty input, returning empty string');
    return '';
  }
  
  const result = String(input).replace(REGEX_PATTERNS.NUMBERS_ONLY, '');
  console.log('[StringUtil] extractNumbers result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Keeps only letters (including Spanish characters) and spaces
 * @param {*} input - Input string to filter
 * @returns {string} String with only letters and spaces
 */
export const extractLetters = (input) => {
  console.log('[StringUtil] extractLetters input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] extractLetters: Empty input, returning input');
    return input || '';
  }
  
  const result = String(input).replace(REGEX_PATTERNS.LETTERS_ONLY, '');
  console.log('[StringUtil] extractLetters result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Keeps only letters, numbers and spaces
 * @param {*} input - Input string to filter
 * @returns {string} String with only alphanumeric characters and spaces
 */
export const extractAlphanumeric = (input) => {
  console.log('[StringUtil] extractAlphanumeric input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] extractAlphanumeric: Empty input, returning input');
    return input || '';
  }
  
  const result = String(input)
    .replace(REGEX_PATTERNS.LETTERS_AND_NUMBERS, '')
    .trim();
    
  console.log('[StringUtil] extractAlphanumeric result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Removes special characters from string
 * @param {*} input - Input string
 * @returns {string} String without special characters
 */
export const removeSpecialCharacters = (input) => {
  console.log('[StringUtil] removeSpecialCharacters input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] removeSpecialCharacters: Empty input, returning empty string');
    return '';
  }
  
  const result = String(input).replace(REGEX_PATTERNS.SPECIAL_CHARACTERS, '');
  console.log('[StringUtil] removeSpecialCharacters result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Removes multiple consecutive spaces, leaving only single spaces
 * @param {*} input - Input string
 * @returns {string} String with normalized spacing
 */
export const normalizeSpaces = (input) => {
  console.log('[StringUtil] normalizeSpaces input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] normalizeSpaces: Empty input, returning empty string');
    return '';
  }
  
  const result = String(input).replace(REGEX_PATTERNS.MULTIPLE_SPACES, ' ').trim();
  console.log('[StringUtil] normalizeSpaces result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// TEXT FORMATTING FUNCTIONS
// ===========================

/**
 * Capitalizes the first letter of each word
 * @param {*} input - Input string
 * @returns {string} String with title case formatting
 */
export const toTitleCase = (input) => {
  console.log('[StringUtil] toTitleCase input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] toTitleCase: Empty input, returning input');
    return input || '';
  }
  
  const result = String(input)
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
    
  console.log('[StringUtil] toTitleCase result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Capitalizes only the first letter of the string
 * @param {*} input - Input string
 * @returns {string} String with first letter capitalized
 */
export const capitalizeFirst = (input) => {
  console.log('[StringUtil] capitalizeFirst input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] capitalizeFirst: Empty input, returning input');
    return input || '';
  }
  
  const stringInput = String(input);
  if (stringInput.length === 0) {
    return stringInput;
  }
  
  const result = stringInput.charAt(0).toUpperCase() + stringInput.slice(1).toLowerCase();
  console.log('[StringUtil] capitalizeFirst result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Truncates text to specified length with ellipsis
 * @param {*} input - Input text to truncate
 * @param {number} maxLength - Maximum length allowed
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated text with suffix if needed
 */
export const truncateText = (input, maxLength, suffix = '...') => {
  console.log('[StringUtil] truncateText input:', JSON.stringify({ input, maxLength, suffix }, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] truncateText: Empty input, returning empty string');
    return '';
  }
  
  const stringInput = String(input);
  
  if (stringInput.length <= maxLength) {
    console.log('[StringUtil] truncateText: Input within limit, returning as-is');
    return stringInput;
  }
  
  // Find last space before the limit to avoid cutting words
  const lastSpaceIndex = stringInput.lastIndexOf(' ', maxLength);
  const cutIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  
  const result = stringInput.slice(0, cutIndex) + suffix;
  console.log('[StringUtil] truncateText result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// SEARCH & COMPARISON FUNCTIONS
// ===========================

/**
 * Case-insensitive string comparison
 * @param {*} value1 - First value to compare
 * @param {*} value2 - Second value to compare
 * @param {boolean} caseSensitive - Whether comparison should be case sensitive
 * @returns {boolean} True if strings are equal
 */
export const compareStrings = (value1, value2, caseSensitive = false) => {
  console.log('[StringUtil] compareStrings input:', JSON.stringify({ value1, value2, caseSensitive }, null, 2));
  
  if (!value1 || !value2) {
    const result = false;
    console.log('[StringUtil] compareStrings: One or both values are falsy, returning false');
    return result;
  }
  
  let str1 = String(value1);
  let str2 = String(value2);
  
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }
  
  const result = str1 === str2;
  console.log('[StringUtil] compareStrings result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Case-insensitive substring search
 * @param {*} haystack - String to search in
 * @param {*} needle - String to search for
 * @param {boolean} caseSensitive - Whether search should be case sensitive
 * @returns {boolean} True if needle is found in haystack
 */
export const containsString = (haystack, needle, caseSensitive = false) => {
  console.log('[StringUtil] containsString input:', JSON.stringify({ haystack, needle, caseSensitive }, null, 2));
  
  if (!haystack || !needle) {
    console.log('[StringUtil] containsString: Empty haystack or needle, returning false');
    return false;
  }
  
  let searchIn = String(haystack);
  let searchFor = String(needle);
  
  if (!caseSensitive) {
    searchIn = searchIn.toLowerCase();
    searchFor = searchFor.toLowerCase();
  }
  
  const result = searchIn.indexOf(searchFor) !== -1;
  console.log('[StringUtil] containsString result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Searches for text in string, ignoring spaces and case
 * @param {*} text - Text to search in
 * @param {*} query - Query to search for
 * @returns {boolean} True if query found in text
 */
export const fuzzySearch = (text = '', query = '') => {
  console.log('[StringUtil] fuzzySearch input:', JSON.stringify({ text, query }, null, 2));
  
  const normalizedText = localToString(text).toLowerCase().replace(/\s/g, '');
  const normalizedQuery = localToString(query).toLowerCase().replace(/\s/g, '');
  
  const result = normalizedText.includes(normalizedQuery);
  console.log('[StringUtil] fuzzySearch result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// VALIDATION FUNCTIONS
// ===========================

/**
 * Validates email format using RFC compliant regex
 * @param {*} email - Email string to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmail = (email) => {
  console.log('[StringUtil] isValidEmail input:', JSON.stringify(email, null, 2));
  
  if (!email) {
    console.log('[StringUtil] isValidEmail: Empty email, returning false');
    return false;
  }
  
  const result = REGEX_PATTERNS.EMAIL.test(String(email).toLowerCase().trim());
  console.log('[StringUtil] isValidEmail result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Checks if string contains whitespace characters
 * @param {*} input - Input string to check
 * @returns {boolean} True if string contains whitespace
 */
export const hasWhitespace = (input) => {
  console.log('[StringUtil] hasWhitespace input:', JSON.stringify(input, null, 2));
  
  if (!input && input !== 0) {
    console.log('[StringUtil] hasWhitespace: Empty input, returning false');
    return false;
  }
  
  const result = REGEX_PATTERNS.WHITESPACE.test(String(input));
  console.log('[StringUtil] hasWhitespace result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Converts object to URL query string
 * @param {Object} obj - Object to convert
 * @returns {string} URL encoded query string
 */
export const objectToQueryString = (obj) => {
  console.log('[StringUtil] objectToQueryString input:', JSON.stringify(obj, null, 2));
  
  if (!obj || typeof obj !== 'object') {
    console.log('[StringUtil] objectToQueryString: Invalid object, returning empty string');
    return '';
  }
  
  const pairs = [];
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });
  
  const result = pairs.join('&');
  console.log('[StringUtil] objectToQueryString result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Splits text at specified limit, respecting word boundaries
 * @param {*} content - Content to split
 * @param {number} characterLimit - Character limit for first part
 * @returns {Object} Object with first and second parts
 */
export const splitTextAtLimit = (content, characterLimit) => {
  console.log('[StringUtil] splitTextAtLimit input:', JSON.stringify({ content, characterLimit }, null, 2));
  
  if (!content) {
    const result = { first: '', second: '' };
    console.log('[StringUtil] splitTextAtLimit: Empty content, returning empty parts');
    return result;
  }
  
  const stringContent = String(content);
  
  if (stringContent.length <= characterLimit) {
    const result = { first: stringContent, second: '' };
    console.log('[StringUtil] splitTextAtLimit: Content within limit, returning as first part');
    return result;
  }
  
  let splitIndex = characterLimit;
  
  // Find last space before the limit to avoid cutting words
  if (stringContent.indexOf(' ') !== -1) {
    while (stringContent.charAt(splitIndex) !== ' ' && splitIndex > 0) {
      splitIndex--;
    }
  }
  
  const result = {
    first: stringContent.substring(0, splitIndex),
    second: stringContent.substring(splitIndex + 1)
  };
  
  console.log('[StringUtil] splitTextAtLimit result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// LEGACY COMPATIBILITY (Deprecated - use new functions)
// ===========================

/**
 * @deprecated Use hasStringContent instead
 */
export const emptyString = (input) => {
  console.warn('[StringUtil] emptyString is deprecated. Use hasStringContent instead.');
  return hasStringContent(input);
};

/**
 * @deprecated Use safeStringToNumber instead
 */
export const localToNumber = (input) => {
  console.warn('[StringUtil] localToNumber is deprecated. Use safeStringToNumber instead.');
  return safeStringToNumber(input, 0);
};

/**
 * @deprecated Use toTitleCase instead
 */
export const capitalize = (input) => {
  console.warn('[StringUtil] capitalize is deprecated. Use toTitleCase instead.');
  return toTitleCase(input);
};

/**
 * @deprecated Use capitalizeFirst instead
 */
export const capitalizeFirstLetter = (input) => {
  console.warn('[StringUtil] capitalizeFirstLetter is deprecated. Use capitalizeFirst instead.');
  return capitalizeFirst(input);
};

/**
 * @deprecated Use extractNumbers instead
 */
export const cleanNumber = (input) => {
  console.warn('[StringUtil] cleanNumber is deprecated. Use extractNumbers instead.');
  return extractNumbers(input);
};

/**
 * @deprecated Use extractLetters instead
 */
export const onlyLetters = (input) => {
  console.warn('[StringUtil] onlyLetters is deprecated. Use extractLetters instead.');
  return extractLetters(input);
};

/**
 * @deprecated Use extractAlphanumeric instead
 */
export const onlyLettersAndNumbers = (input) => {
  console.warn('[StringUtil] onlyLettersAndNumbers is deprecated. Use extractAlphanumeric instead.');
  return extractAlphanumeric(input);
};

/**
 * @deprecated Use compareStrings instead
 */
export const isEqualString = (v1, v2, caseSensitive = false) => {
  console.warn('[StringUtil] isEqualString is deprecated. Use compareStrings instead.');
  return compareStrings(v1, v2, caseSensitive);
};

/**
 * @deprecated Use containsString instead
 */
export const containString = (v1, v2, caseSensitive = false) => {
  console.warn('[StringUtil] containString is deprecated. Use containsString instead.');
  return containsString(v1, v2, caseSensitive);
};

/**
 * @deprecated Use fuzzySearch instead
 */
export const searchInString = (text, query) => {
  console.warn('[StringUtil] searchInString is deprecated. Use fuzzySearch instead.');
  return fuzzySearch(text, query);
};

/**
 * @deprecated Use isValidEmail instead
 */
export const validateEmail = (email) => {
  console.warn('[StringUtil] validateEmail is deprecated. Use isValidEmail instead.');
  return isValidEmail(email);
};

/**
 * @deprecated Use truncateText instead
 */
export const limitString = (text, limit) => {
  console.warn('[StringUtil] limitString is deprecated. Use truncateText instead.');
  return truncateText(text, limit);
};

/**
 * @deprecated Use normalizeSpaces instead
 */
export const eliminarEspaciosExtra = (str) => {
  console.warn('[StringUtil] eliminarEspaciosExtra is deprecated. Use normalizeSpaces instead.');
  return normalizeSpaces(str);
};

/**
 * @deprecated Use hasWhitespace instead
 */
export const tieneEspaciosEnBlanco = (input) => {
  console.warn('[StringUtil] tieneEspaciosEnBlanco is deprecated. Use hasWhitespace instead.');
  return hasWhitespace(input);
};

/**
 * @deprecated Use objectToQueryString instead
 */
export const objToQueryString = (obj) => {
  console.warn('[StringUtil] objToQueryString is deprecated. Use objectToQueryString instead.');
  return objectToQueryString(obj);
};

/**
 * @deprecated Use splitTextAtLimit instead
 */
export const splitTextByLimit = (content, characterLimit) => {
  console.warn('[StringUtil] splitTextByLimit is deprecated. Use splitTextAtLimit instead.');
  return splitTextAtLimit(content, characterLimit);
};

// ===========================
// LEGACY CONSTANTS
// ===========================

/**
 * @deprecated Use STRING_VALIDATION_MESSAGES instead
 */
export const defaultString = {
  requiredText: STRING_VALIDATION_MESSAGES.REQUIRED,
  validEmail: STRING_VALIDATION_MESSAGES.INVALID_EMAIL,
  validUrl: STRING_VALIDATION_MESSAGES.INVALID_URL,
  validPhone: STRING_VALIDATION_MESSAGES.INVALID_PHONE,
  validRnc: STRING_VALIDATION_MESSAGES.INVALID_RNC,
  validDocument: STRING_VALIDATION_MESSAGES.INVALID_DOCUMENT
};

// ===========================
// BARREL EXPORTS
// ===========================

export default {
  // Constants
  STRING_VALIDATION_MESSAGES,
  CURRENCY_SYMBOLS,
  
  // Core functions (actively used)
  localToString,
  
  // Enhanced functionality
  hasStringContent,
  safeStringToNumber,
  cleanString,
  extractNumbers,
  extractLetters,
  extractAlphanumeric,
  removeSpecialCharacters,
  normalizeSpaces,
  toTitleCase,
  capitalizeFirst,
  truncateText,
  compareStrings,
  containsString,
  fuzzySearch,
  isValidEmail,
  hasWhitespace,
  objectToQueryString,
  splitTextAtLimit,
  
  // Legacy (deprecated)
  emptyString,
  localToNumber,
  capitalize,
  capitalizeFirstLetter,
  cleanNumber,
  onlyLetters,
  onlyLettersAndNumbers,
  isEqualString,
  containString,
  searchInString,
  validateEmail,
  limitString,
  eliminarEspaciosExtra,
  tieneEspaciosEnBlanco,
  objToQueryString,
  splitTextByLimit,
  defaultString
};
