/**
 * @fileoverview Encryption and decryption utilities for sensitive data
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import CryptoJS from 'expo-crypto';

import { appConfig } from '../config/app.config';
import { logger } from './logger';
import { SECURITY_CONSTANTS } from '../../shared/constants';

/**
 * Encrypted data structure
 */
interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

/**
 * Encryption utility class
 */
class EncryptionUtil {
  private readonly encryptionKey: string;

  constructor() {
    this.encryptionKey = appConfig.encryptionKey;
    
    if (!this.encryptionKey || this.encryptionKey === 'default-encryption-key') {
      logger.warn('Using default encryption key. This is not secure for production!');
    }
  }

  /**
   * Generates a random initialization vector
   * @returns Random IV as hex string
   */
  private generateIV(): string {
    try {
      const randomBytes = CryptoJS.getRandomBytes(SECURITY_CONSTANTS.IV_LENGTH);
      // Convert Uint8Array directly to hex without using ArrayBuffer
      return Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      logger.error('Failed to generate IV', error, 'ENCRYPTION');
      throw new Error('Encryption initialization failed');
    }
  }

  /**
   * Converts ArrayBuffer to hex string
   * @param buffer ArrayBuffer to convert
   * @returns Hex string representation
   */
  private arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Converts hex string to ArrayBuffer
   * @param hex Hex string to convert
   * @returns ArrayBuffer representation
   */
  private hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  /**
   * Creates a hash of the input data
   * @param data Data to hash
   * @returns Hash as hex string
   */
  public async createHash(data: string): Promise<string> {
    try {
      logger.debug('Creating hash for data', undefined, 'ENCRYPTION');
      
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await CryptoJS.digest(CryptoJS.CryptoDigestAlgorithm.SHA256, dataBuffer);
      
      return this.arrayBufferToHex(hashBuffer);
    } catch (error) {
      logger.error('Failed to create hash', error, 'ENCRYPTION');
      throw new Error('Hash creation failed');
    }
  }

  /**
   * Encrypts data using AES-GCM algorithm
   * @param data Data to encrypt
   * @returns Encrypted data object
   */
  public async encrypt(data: string): Promise<EncryptedData> {
    try {
      logger.debug('Encrypting sensitive data', undefined, 'ENCRYPTION');
      
      const iv = this.generateIV();
      const encoder = new TextEncoder();
      
      // Prepare key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Derive encryption key
      const encryptionKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('salt'), // In production, use random salt
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // Encrypt data
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: this.hexToArrayBuffer(iv),
        },
        encryptionKey,
        encoder.encode(data)
      );

      const encryptedArray = new Uint8Array(encryptedBuffer);
      const encryptedData = this.arrayBufferToHex(encryptedArray.buffer);

      logger.debug('Data encrypted successfully', undefined, 'ENCRYPTION');
      
      return {
        encryptedData,
        iv,
        authTag: '', // AES-GCM includes auth tag in encrypted data
      };
    } catch (error) {
      logger.error('Encryption failed', error, 'ENCRYPTION');
      throw new Error('Data encryption failed');
    }
  }

  /**
   * Decrypts data using AES-GCM algorithm
   * @param encryptedData Encrypted data object
   * @returns Decrypted string
   */
  public async decrypt(encryptedData: EncryptedData): Promise<string> {
    try {
      logger.debug('Decrypting sensitive data', undefined, 'ENCRYPTION');
      
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      // Prepare key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Derive decryption key
      const decryptionKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('salt'), // Should match encryption salt
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      // Decrypt data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.hexToArrayBuffer(encryptedData.iv),
        },
        decryptionKey,
        this.hexToArrayBuffer(encryptedData.encryptedData)
      );

      const decryptedText = decoder.decode(decryptedBuffer);
      
      logger.debug('Data decrypted successfully', undefined, 'ENCRYPTION');
      
      return decryptedText;
    } catch (error) {
      logger.error('Decryption failed', error, 'ENCRYPTION');
      throw new Error('Data decryption failed');
    }
  }

  /**
   * Encrypts an object by converting to JSON first
   * @param obj Object to encrypt
   * @returns Encrypted data object
   */
  public async encryptObject<T>(obj: T): Promise<EncryptedData> {
    try {
      const jsonString = JSON.stringify(obj);
      return await this.encrypt(jsonString);
    } catch (error) {
      logger.error('Object encryption failed', error, 'ENCRYPTION');
      throw new Error('Object encryption failed');
    }
  }

  /**
   * Decrypts data and parses as JSON object
   * @param encryptedData Encrypted data object
   * @returns Decrypted object
   */
  public async decryptObject<T>(encryptedData: EncryptedData): Promise<T> {
    try {
      const jsonString = await this.decrypt(encryptedData);
      return JSON.parse(jsonString) as T;
    } catch (error) {
      logger.error('Object decryption failed', error, 'ENCRYPTION');
      throw new Error('Object decryption failed');
    }
  }

  /**
   * Validates encryption key strength
   * @returns True if key meets security requirements
   */
  public validateEncryptionKey(): boolean {
    const key = this.encryptionKey;
    
    if (!key || key.length < 32) {
      logger.warn('Encryption key is too short (minimum 32 characters)', undefined, 'ENCRYPTION');
      return false;
    }
    
    if (key === 'default-encryption-key') {
      logger.warn('Using default encryption key is not secure', undefined, 'ENCRYPTION');
      return false;
    }
    
    return true;
  }
}

/**
 * Singleton encryption utility instance
 */
export const encryptionUtil = new EncryptionUtil();

/**
 * Quick encrypt function for sensitive strings
 * @param data String to encrypt
 * @returns Encrypted data object
 */
export const encryptSensitiveData = async (data: string): Promise<EncryptedData> => {
  return encryptionUtil.encrypt(data);
};

/**
 * Quick decrypt function for sensitive strings
 * @param encryptedData Encrypted data object
 * @returns Decrypted string
 */
export const decryptSensitiveData = async (encryptedData: EncryptedData): Promise<string> => {
  return encryptionUtil.decrypt(encryptedData);
};
