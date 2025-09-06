/**
 * Document Validation and Processing Utilities
 * 
 * This module provides comprehensive utilities for handling Dominican Republic
 * document types including Cédula, RNC, and Pasaporte validation, formatting,
 * and input management.
 * 
 * @description Document processing utilities with validation, formatting, and input handling
 * @version 1.0.0
 * @author Eduardo Valenzuela
 */

// ===========================
// CONSTANTS & ENUMS
// ===========================

/**
 * Document type enumeration for type safety and consistency
 * @readonly
 * @enum {string}
 */
export const DOCUMENT_TYPES = Object.freeze({
  CEDULA: 'CEDULA',
  RNC: 'RNC',
  PASAPORTE: 'PASAPORTE'
});

/**
 * Document type display names for UI presentation
 * @readonly
 * @enum {string}
 */
export const DOCUMENT_TYPE_LABELS = Object.freeze({
  [DOCUMENT_TYPES.CEDULA]: 'Cédula',
  [DOCUMENT_TYPES.RNC]: 'RNC', 
  [DOCUMENT_TYPES.PASAPORTE]: 'Pasaporte'
});

/**
 * Document type abbreviations for compact display
 * @readonly
 * @enum {string}
 */
export const DOCUMENT_TYPE_CODES = Object.freeze({
  [DOCUMENT_TYPES.CEDULA]: 'CED',
  [DOCUMENT_TYPES.RNC]: 'RNC',
  [DOCUMENT_TYPES.PASAPORTE]: 'PAS'
});

/**
 * Document type mapping by numeric ID (for API compatibility)
 * @readonly
 * @enum {Object}
 */
export const DOCUMENT_TYPE_BY_ID = Object.freeze({
  1: { type: DOCUMENT_TYPES.CEDULA, label: 'Cédula', code: 'CED' },
  2: { type: DOCUMENT_TYPES.PASAPORTE, label: 'Pasaporte', code: 'PAS' },
  3: { type: DOCUMENT_TYPES.RNC, label: 'RNC', code: 'RNC' }
});

/**
 * Reverse mapping: document type to numeric ID
 * @readonly
 * @enum {number}
 */
export const DOCUMENT_ID_BY_TYPE = Object.freeze({
  [DOCUMENT_TYPES.CEDULA]: 1,
  [DOCUMENT_TYPES.PASAPORTE]: 2,
  [DOCUMENT_TYPES.RNC]: 3
});

/**
 * Document validation rules and constraints
 * @readonly
 * @enum {Object}
 */
export const DOCUMENT_VALIDATION_RULES = Object.freeze({
  [DOCUMENT_TYPES.CEDULA]: {
    minLength: 11,
    maxLength: 11,
    pattern: /^\d{11}$/,
    inputPattern: /\d/g,
    keyboardType: 'numeric',
    autoCapitalize: 'none',
    placeholder: '000-0000000-0',
    errorMessages: {
      required: 'La cédula es requerida',
      invalid: 'La cédula debe tener exactamente 11 dígitos',
      format: 'Formato de cédula inválido'
    }
  },
  [DOCUMENT_TYPES.RNC]: {
    minLength: 1,
    maxLength: 9,
    pattern: /^\d{1,9}$/,
    inputPattern: /\d/g,
    keyboardType: 'numeric',
    autoCapitalize: 'none',
    placeholder: '123456789',
    errorMessages: {
      required: 'El RNC es requerido',
      invalid: 'El RNC debe tener entre 1 y 9 dígitos',
      format: 'El RNC solo puede contener números'
    }
  },
  [DOCUMENT_TYPES.PASAPORTE]: {
    minLength: 8,
    maxLength: 24,
    pattern: /^[A-Z0-9]{8,24}$/,
    inputPattern: /[A-Za-z0-9]/g,
    keyboardType: 'default',
    autoCapitalize: 'characters',
    placeholder: 'A1234567B',
    errorMessages: {
      required: 'El pasaporte es requerido',
      invalid: 'El pasaporte debe tener entre 8 y 24 caracteres',
      format: 'El pasaporte solo puede contener letras y números'
    }
  }
});

// ===========================
// CACHED REGEX PATTERNS (Performance Optimization)
// ===========================

const REGEX_CACHE = Object.freeze({
  NUMBERS_ONLY: /\D/g,
  ALPHANUMERIC_ONLY: /[^A-Za-z0-9]/g,
  CEDULA_FORMAT: /^(\d{3})(\d{7})(\d{1})$/,
  CEDULA_VALIDATION: /^\d{11}$/,
  RNC_VALIDATION: /^\d{1,9}$/,
  PASSPORT_VALIDATION: /^[A-Z0-9]{8,24}$/
});

// ===========================
// CORE CONVERSION FUNCTIONS
// ===========================

/**
 * Converts various document type inputs to standardized type enum
 * @param {string|number} input - Document type input (string, abbreviation, or ID)
 * @returns {string|null} Standardized document type or null if invalid
 * @example
 * normalizeDocumentType('cédula') // 'CEDULA'
 * normalizeDocumentType('CED') // 'CEDULA'
 * normalizeDocumentType(1) // 'CEDULA'
 */
export const normalizeDocumentType = (input) => {
  console.log('[DocumentUtil] normalizeDocumentType input:', JSON.stringify(input, null, 2));
  
  if (!input) {
    console.log('[DocumentUtil] normalizeDocumentType: No input provided');
    return null;
  }

  // Handle numeric ID
  if (typeof input === 'number') {
    const result = DOCUMENT_TYPE_BY_ID[input]?.type || null;
    console.log('[DocumentUtil] normalizeDocumentType by ID result:', JSON.stringify(result, null, 2));
    return result;
  }

  // Handle string input
  const normalized = String(input).toLowerCase().trim();
  
  // Direct type matches
  const typeMap = {
    'cedula': DOCUMENT_TYPES.CEDULA,
    'cédula': DOCUMENT_TYPES.CEDULA,
    'ced': DOCUMENT_TYPES.CEDULA,
    'rnc': DOCUMENT_TYPES.RNC,
    'pasaporte': DOCUMENT_TYPES.PASAPORTE,
    'pas': DOCUMENT_TYPES.PASAPORTE,
    'passport': DOCUMENT_TYPES.PASAPORTE
  };

  const result = typeMap[normalized] || null;
  console.log('[DocumentUtil] normalizeDocumentType string result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Gets document type information by numeric ID
 * @param {number} documentTypeId - Numeric document type ID
 * @returns {Object} Document type information object
 */
export const getDocumentTypeById = (documentTypeId) => {
  console.log('[DocumentUtil] getDocumentTypeById input:', JSON.stringify(documentTypeId, null, 2));
  
  const result = DOCUMENT_TYPE_BY_ID[documentTypeId] || {
    type: null,
    label: 'DOCUMENTO NO MANEJADO',
    code: 'UNK'
  };
  
  console.log('[DocumentUtil] getDocumentTypeById result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Gets abbreviated document type code
 * @param {string|number} input - Document type input
 * @returns {string} Document type abbreviation (CED, RNC, PAS)
 */
export const getDocumentTypeCode = (input) => {
  const documentType = normalizeDocumentType(input);
  return documentType ? DOCUMENT_TYPE_CODES[documentType] : 'UNK';
};

/**
 * Gets display label for document type
 * @param {string|number} input - Document type input
 * @returns {string} Human-readable document type label
 */
export const getDocumentTypeLabel = (input) => {
  const documentType = normalizeDocumentType(input);
  return documentType ? DOCUMENT_TYPE_LABELS[documentType] : 'Tipo desconocido';
};

// ===========================
// VALIDATION FUNCTIONS
// ===========================

/**
 * Sanitizes and normalizes document number input
 * @param {string} input - Raw document number input
 * @returns {string} Sanitized document number
 */
export const sanitizeDocumentNumber = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input.trim().replace(/\s+/g, '');
};

/**
 * Validates document number based on document type with enhanced error handling
 * @param {string|number} documentType - Document type (code or enum)
 * @param {string} documentNumber - Document number to validate
 * @returns {Object} Validation result with isValid, message, and details
 * @example
 * validateDocumentNumber('CEDULA', '12345678901')
 * // Returns: { isValid: true, message: '', details: { cleanNumber: '12345678901' } }
 */
export const validateDocumentNumber = (documentType, documentNumber) => {
  console.log('[DocumentUtil] validateDocumentNumber inputs:', JSON.stringify({ documentType, documentNumber }, null, 2));
  
  const normalizedType = normalizeDocumentType(documentType);
  const sanitizedNumber = sanitizeDocumentNumber(documentNumber);
  
  // Input validation
  if (!normalizedType) {
    const result = { isValid: false, message: 'Tipo de documento no válido', details: null };
    console.log('[DocumentUtil] validateDocumentNumber - invalid type:', JSON.stringify(result, null, 2));
    return result;
  }
  
  if (!sanitizedNumber) {
    const rules = DOCUMENT_VALIDATION_RULES[normalizedType];
    const result = { 
      isValid: false, 
      message: rules.errorMessages.required, 
      details: null 
    };
    console.log('[DocumentUtil] validateDocumentNumber - empty number:', JSON.stringify(result, null, 2));
    return result;
  }
  
  const rules = DOCUMENT_VALIDATION_RULES[normalizedType];
  
  // Type-specific validation
  switch (normalizedType) {
    case DOCUMENT_TYPES.CEDULA: {
      const numbersOnly = sanitizedNumber.replace(REGEX_CACHE.NUMBERS_ONLY, '');
      
      if (numbersOnly.length !== rules.maxLength) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.invalid,
          details: { providedLength: numbersOnly.length, requiredLength: rules.maxLength }
        };
        console.log('[DocumentUtil] validateDocumentNumber - cedula length error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      if (!REGEX_CACHE.CEDULA_VALIDATION.test(numbersOnly)) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.format,
          details: { cleanNumber: numbersOnly }
        };
        console.log('[DocumentUtil] validateDocumentNumber - cedula format error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      const result = { 
        isValid: true, 
        message: '', 
        details: { cleanNumber: numbersOnly, formattedNumber: formatCedulaNumber(numbersOnly) }
      };
      console.log('[DocumentUtil] validateDocumentNumber - cedula valid:', JSON.stringify(result, null, 2));
      return result;
    }
    
    case DOCUMENT_TYPES.RNC: {
      const numbersOnly = sanitizedNumber.replace(REGEX_CACHE.NUMBERS_ONLY, '');
      
      if (numbersOnly.length < rules.minLength || numbersOnly.length > rules.maxLength) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.invalid,
          details: { 
            providedLength: numbersOnly.length, 
            minLength: rules.minLength, 
            maxLength: rules.maxLength 
          }
        };
        console.log('[DocumentUtil] validateDocumentNumber - RNC length error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      if (!REGEX_CACHE.RNC_VALIDATION.test(numbersOnly)) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.format,
          details: { cleanNumber: numbersOnly }
        };
        console.log('[DocumentUtil] validateDocumentNumber - RNC format error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      const result = { 
        isValid: true, 
        message: '', 
        details: { cleanNumber: numbersOnly }
      };
      console.log('[DocumentUtil] validateDocumentNumber - RNC valid:', JSON.stringify(result, null, 2));
      return result;
    }
    
    case DOCUMENT_TYPES.PASAPORTE: {
      const upperCaseNumber = sanitizedNumber.toUpperCase();
      
      if (upperCaseNumber.length < rules.minLength || upperCaseNumber.length > rules.maxLength) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.invalid,
          details: { 
            providedLength: upperCaseNumber.length, 
            minLength: rules.minLength, 
            maxLength: rules.maxLength 
          }
        };
        console.log('[DocumentUtil] validateDocumentNumber - passport length error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      if (!REGEX_CACHE.PASSPORT_VALIDATION.test(upperCaseNumber)) {
        const result = { 
          isValid: false, 
          message: rules.errorMessages.format,
          details: { providedNumber: upperCaseNumber }
        };
        console.log('[DocumentUtil] validateDocumentNumber - passport format error:', JSON.stringify(result, null, 2));
        return result;
      }
      
      const result = { 
        isValid: true, 
        message: '', 
        details: { cleanNumber: upperCaseNumber }
      };
      console.log('[DocumentUtil] validateDocumentNumber - passport valid:', JSON.stringify(result, null, 2));
      return result;
    }
    
    default: {
      const result = { 
        isValid: false, 
        message: 'Tipo de documento no soportado',
        details: { documentType: normalizedType }
      };
      console.log('[DocumentUtil] validateDocumentNumber - unsupported type:', JSON.stringify(result, null, 2));
      return result;
    }
  }
};

// ===========================
// INPUT HANDLING FUNCTIONS
// ===========================

/**
 * Applies input restrictions and formatting based on document type
 * @param {string|number} documentType - Document type (code or enum)
 * @param {string} inputText - Raw input text to process
 * @returns {string} Processed and restricted input text
 * @example
 * applyDocumentInputRestrictions('CEDULA', 'abc123def456') // '123456'
 */
export const applyDocumentInputRestrictions = (documentType, inputText) => {
  console.log('[DocumentUtil] applyDocumentInputRestrictions inputs:', JSON.stringify({ documentType, inputText }, null, 2));
  
  const normalizedType = normalizeDocumentType(documentType);
  
  if (!normalizedType || !inputText) {
    console.log('[DocumentUtil] applyDocumentInputRestrictions - invalid inputs');
    return inputText || '';
  }
  
  const rules = DOCUMENT_VALIDATION_RULES[normalizedType];
  let result = '';
  
  switch (normalizedType) {
    case DOCUMENT_TYPES.CEDULA:
    case DOCUMENT_TYPES.RNC: {
      // Numbers only, with length restriction
      result = inputText
        .replace(REGEX_CACHE.NUMBERS_ONLY, '')
        .slice(0, rules.maxLength);
      break;
    }
    
    case DOCUMENT_TYPES.PASAPORTE: {
      // Alphanumeric only, uppercase, with length restriction
      result = inputText
        .replace(REGEX_CACHE.ALPHANUMERIC_ONLY, '')
        .slice(0, rules.maxLength)
        .toUpperCase();
      break;
    }
    
    default:
      result = inputText;
  }
  
  console.log('[DocumentUtil] applyDocumentInputRestrictions result:', JSON.stringify(result, null, 2));
  return result;
};

// ===========================
// FORMATTING FUNCTIONS
// ===========================

/**
 * Formats a cédula number with standard Dominican format (000-0000000-0)
 * @param {string} numero - Clean cédula number (11 digits)
 * @returns {string} Formatted cédula number
 */
export const formatCedulaNumber = (numero) => {
  if (!numero || typeof numero !== 'string') {
    return '';
  }
  
  const numbersOnly = numero.replace(REGEX_CACHE.NUMBERS_ONLY, '');
  
  if (numbersOnly.length !== 11) {
    return numero; // Return as-is if not exactly 11 digits
  }
  
  const match = numbersOnly.match(REGEX_CACHE.CEDULA_FORMAT);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : numero;
};

/**
 * Formats document number for display based on document type
 * @param {string|number} documentType - Document type (code or enum)
 * @param {string} documentNumber - Document number to format
 * @param {Object} options - Formatting options
 * @param {Function} options.customCedulaFormatter - Custom cédula formatter function
 * @returns {string} Formatted document number
 */
export const formatDocumentNumberForDisplay = (documentType, documentNumber, options = {}) => {
  console.log('[DocumentUtil] formatDocumentNumberForDisplay inputs:', JSON.stringify({ documentType, documentNumber, options }, null, 2));
  
  if (!documentNumber) {
    console.log('[DocumentUtil] formatDocumentNumberForDisplay - no document number');
    return '';
  }
  
  const normalizedType = normalizeDocumentType(documentType);
  let result = '';
  
  switch (normalizedType) {
    case DOCUMENT_TYPES.CEDULA: {
      // Use custom formatter if provided, otherwise use built-in
      const formatter = options.customCedulaFormatter || formatCedulaNumber;
      result = formatter(documentNumber);
      break;
    }
    
    case DOCUMENT_TYPES.PASAPORTE: {
      // Passport: uppercase, preserve original format
      result = documentNumber.toUpperCase();
      break;
    }
    
    case DOCUMENT_TYPES.RNC: {
      // RNC: numbers only, no special formatting
      result = documentNumber.replace(REGEX_CACHE.NUMBERS_ONLY, '');
      break;
    }
    
    default:
      result = documentNumber;
  }
  
  console.log('[DocumentUtil] formatDocumentNumberForDisplay result:', JSON.stringify(result, null, 2));
  return result;
};

/**
 * Prepares document number for API submission (clean, normalized data)
 * @param {string|number} documentType - Document type (code or enum)
 * @param {string} documentNumber - Document number to clean
 * @returns {string} Clean document number ready for API submission
 */
export const prepareDocumentNumberForApi = (documentType, documentNumber) => {
  console.log('[DocumentUtil] prepareDocumentNumberForApi inputs:', JSON.stringify({ documentType, documentNumber }, null, 2));
  
  if (!documentNumber) {
    console.log('[DocumentUtil] prepareDocumentNumberForApi - no document number');
    return '';
  }
  
  const normalizedType = normalizeDocumentType(documentType);
  let result = '';
  
  switch (normalizedType) {
    case DOCUMENT_TYPES.CEDULA:
    case DOCUMENT_TYPES.RNC: {
      // Send only numbers, no formatting
      result = documentNumber.replace(REGEX_CACHE.NUMBERS_ONLY, '');
      break;
    }
    
    case DOCUMENT_TYPES.PASAPORTE: {
      // Send in uppercase, alphanumeric only
      result = documentNumber
        .replace(REGEX_CACHE.ALPHANUMERIC_ONLY, '')
        .toUpperCase();
      break;
    }
    
    default:
      result = documentNumber;
  }
  
  console.log('[DocumentUtil] prepareDocumentNumberForApi result:', JSON.stringify(result, null, 2));
  return result;
};

export const validateRnc = (rnc) => {
  if (!rnc) {
    return 0;
  }

  rnc = rnc.replace(/ /g, "");

  const reg = /^[0-9]{9}[a-z]?$/i;

  if (!reg.test(rnc)) {
    return 0;
  }

  return 1;
};

export const validatePassport = (passport) => {
  if (!passport) {
    return 0;
  }

  passport = passport.replace(/ /g, "");

  const reg = /^[a-z]{2}[0-9]{7}[a-z]?$/i;
  const reg2 = /^[a-z]{1}[0-9]{8}[a-z]?$/i;

  if (!reg.test(passport) || reg2.test(passport)) {
    return 0;
  }

  return 1;
};

// ===========================
// INPUT CONFIGURATION FUNCTIONS
// ===========================

/**
 * Gets complete input configuration for a document type
 * @param {string|number} documentType - Document type (code or enum)
 * @returns {Object} Input configuration object
 * @example
 * getDocumentInputConfiguration('CEDULA')
 * // Returns: { placeholder: '000-0000000-0', keyboardType: 'numeric', autoCapitalize: 'none', maxLength: 11 }
 */
export const getDocumentInputConfiguration = (documentType) => {
  const normalizedType = normalizeDocumentType(documentType);
  
  if (!normalizedType) {
    return {
      placeholder: 'Número de documento',
      keyboardType: 'default',
      autoCapitalize: 'none',
      maxLength: 50
    };
  }
  
  const rules = DOCUMENT_VALIDATION_RULES[normalizedType];
  
  return {
    placeholder: rules.placeholder,
    keyboardType: rules.keyboardType,
    autoCapitalize: rules.autoCapitalize,
    maxLength: rules.maxLength
  };
};

/**
 * Gets placeholder text for document input based on type
 * @param {string|number} documentType - Document type (code or enum)
 * @returns {string} Placeholder text
 */
export const getDocumentPlaceholder = (documentType) => {
  const config = getDocumentInputConfiguration(documentType);
  return config.placeholder;
};

/**
 * Gets keyboard type for document input based on type
 * @param {string|number} documentType - Document type (code or enum)
 * @returns {string} Keyboard type (numeric, default)
 */
export const getDocumentKeyboardType = (documentType) => {
  const config = getDocumentInputConfiguration(documentType);
  return config.keyboardType;
};

/**
 * Gets auto-capitalize setting for document input based on type
 * @param {string|number} documentType - Document type (code or enum)
 * @returns {string} Auto-capitalize setting (characters, none)
 */
export const getDocumentAutoCapitalize = (documentType) => {
  const config = getDocumentInputConfiguration(documentType);
  return config.autoCapitalize;
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Detects document type from number pattern (heuristic analysis)
 * @param {string} documentNumber - Document number to analyze
 * @returns {string|null} Detected document type or null if undetermined
 */
export const detectDocumentType = (documentNumber) => {
  if (!documentNumber || typeof documentNumber !== 'string') {
    return null;
  }
  
  const clean = documentNumber.replace(/\D/g, '');
  
  // Cédula: exactly 11 digits
  if (clean.length === 11 && /^\d{11}$/.test(clean)) {
    return DOCUMENT_TYPES.CEDULA;
  }
  
  // RNC: 1-9 digits, numbers only
  if (clean.length >= 1 && clean.length <= 9 && /^\d+$/.test(clean)) {
    return DOCUMENT_TYPES.RNC;
  }
  
  // Passport: mixed alphanumeric, 8-24 characters
  if (/^[A-Z0-9]{8,24}$/i.test(documentNumber.replace(/\s/g, ''))) {
    return DOCUMENT_TYPES.PASAPORTE;
  }
  
  return null;
};

/**
 * Validates multiple documents in batch
 * @param {Array<Object>} documents - Array of document objects with type and number
 * @returns {Array<Object>} Array of validation results
 * @example
 * validateDocumentsBatch([
 *   { type: 'CEDULA', number: '12345678901' },
 *   { type: 'RNC', number: '123456789' }
 * ])
 */
export const validateDocumentsBatch = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }
  
  return documents.map((doc, index) => ({
    index,
    ...validateDocumentNumber(doc.type, doc.number)
  }));
};

// ===========================
// LEGACY COMPATIBILITY (Deprecated - use new functions)
// ===========================

/**
 * @deprecated Use normalizeDocumentType instead
 */
export const shortDocumentType = (input) => {
  console.warn('[DocumentUtil] shortDocumentType is deprecated. Use normalizeDocumentType instead.');
  const normalized = normalizeDocumentType(input);
  return normalized ? getDocumentTypeCode(normalized) : null;
};

/**
 * @deprecated Use getDocumentTypeLabel instead
 */
export const documentTypeConditions = (documentType) => {
  console.warn('[DocumentUtil] documentTypeConditions is deprecated. Use getDocumentTypeLabel instead.');
  return getDocumentTypeLabel(documentType);
};

/**
 * @deprecated Use getDocumentTypeById instead
 */
export const documentTypeNumberById = (documentTypeId) => {
  console.warn('[DocumentUtil] documentTypeNumberById is deprecated. Use getDocumentTypeById instead.');
  const info = getDocumentTypeById(documentTypeId);
  return info.label;
};

/**
 * @deprecated Use getDocumentTypeById instead
 */
export const documentTypeAbreviateNumberById = (documentTypeId) => {
  console.warn('[DocumentUtil] documentTypeAbreviateNumberById is deprecated. Use getDocumentTypeById instead.');
  const info = getDocumentTypeById(documentTypeId);
  return info.code;
};

// ===========================
// BARREL EXPORTS
// ===========================

export default {
  // Constants
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_CODES,
  DOCUMENT_TYPE_BY_ID,
  DOCUMENT_ID_BY_TYPE,
  DOCUMENT_VALIDATION_RULES,
  
  // Core functions
  normalizeDocumentType,
  getDocumentTypeById,
  getDocumentTypeCode,
  getDocumentTypeLabel,
  
  // Validation functions
  sanitizeDocumentNumber,
  validateDocumentNumber,
  validateDocumentsBatch,
  
  // Input handling
  applyDocumentInputRestrictions,
  getDocumentInputConfiguration,
  getDocumentPlaceholder,
  getDocumentKeyboardType,
  getDocumentAutoCapitalize,
  
  // Formatting functions
  formatCedulaNumber,
  formatDocumentNumberForDisplay,
  prepareDocumentNumberForApi,
  
  // Utility functions
  detectDocumentType,
  
  // Legacy (deprecated)
  shortDocumentType,
  documentTypeConditions,
  documentTypeNumberById,
  documentTypeAbreviateNumberById
};
