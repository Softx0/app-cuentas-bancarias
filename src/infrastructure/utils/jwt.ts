/**
 * @fileoverview JWT token management utilities for authentication
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { JWTPayload, SignJWT, jwtVerify } from 'jose';

import { AUTH_CONSTANTS } from '../../shared/constants';
import type { AuthToken, User } from '../../shared/types';
import { appConfig, isDevelopment } from '../config/app.config';
import { logger } from './logger';

/**
 * JWT payload interface extending the standard JWT payload
 */
interface CustomJWTPayload extends JWTPayload {
  userId: string;
  email: string;
  role?: string;
  permissions?: string[];
  sessionId?: string;
}

/**
 * Token verification result interface
 */
interface TokenVerificationResult {
  isValid: boolean;
  payload?: CustomJWTPayload;
  error?: string;
  isExpired?: boolean;
}

/**
 * JWT utility class for token management
 */
class JWTUtil {
  private readonly secretKey: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly algorithm = 'HS256';

  constructor() {
    this.secretKey = new TextEncoder().encode(appConfig.jwtSecretKey);
    this.issuer = 'app-cuentas-bancarias';
    this.audience = 'app-users';
    
    if (appConfig.jwtSecretKey === 'default-secret-key') {
      logger.warn('Using default JWT secret key. This is not secure for production!', undefined, 'JWT');
    }
  }

  /**
   * Generates an access token for the user
   * @param user User data to encode in token
   * @param additionalClaims Additional claims to include
   * @returns Generated JWT token
   */
  public async generateAccessToken(user: User, additionalClaims?: Record<string, any>): Promise<string> {
    try {
      logger.debug('Generating access token for user', { userId: user.id }, 'JWT');

      // Use simple mock tokens in development to avoid React Native compatibility issues
      if (isDevelopment()) {
        return this.generateMockAccessToken(user, additionalClaims);
      }

      const now = Math.floor(Date.now() / 1000);
      const expirationTime = now + appConfig.tokenExpiration;

      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: 'user', // Default role, can be customized
        sessionId: this.generateSessionId(),
        ...additionalClaims,
      })
        .setProtectedHeader({ alg: this.algorithm })
        .setIssuedAt(now)
        .setExpirationTime(expirationTime)
        .setIssuer(this.issuer)
        .setAudience(this.audience)
        .setSubject(user.id)
        .sign(this.secretKey);

      logger.info('Access token generated successfully', { userId: user.id, expiresAt: new Date(expirationTime * 1000).toISOString() }, 'JWT');
      
      return token;
    } catch (error) {
      logger.error('Failed to generate access token', error, 'JWT');
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generates a refresh token for the user
   * @param user User data to encode in token
   * @returns Generated refresh JWT token
   */
  public async generateRefreshToken(user: User): Promise<string> {
    try {
      logger.debug('Generating refresh token for user', { userId: user.id }, 'JWT');

      // Use simple mock tokens in development to avoid React Native compatibility issues
      if (isDevelopment()) {
        return this.generateMockRefreshToken(user);
      }

      const now = Math.floor(Date.now() / 1000);
      const expirationTime = now + (appConfig.tokenExpiration * 24 * 7); // 7 days

      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        type: 'refresh',
        sessionId: this.generateSessionId(),
      })
        .setProtectedHeader({ alg: this.algorithm })
        .setIssuedAt(now)
        .setExpirationTime(expirationTime)
        .setIssuer(this.issuer)
        .setAudience(this.audience)
        .setSubject(user.id)
        .sign(this.secretKey);

      logger.info('Refresh token generated successfully', { userId: user.id }, 'JWT');
      
      return token;
    } catch (error) {
      logger.error('Failed to generate refresh token', error, 'JWT');
      throw new Error('Refresh token generation failed');
    }
  }

  /**
   * Generates both access and refresh tokens
   * @param user User data to encode in tokens
   * @returns AuthToken object with both tokens
   */
  public async generateTokenPair(user: User): Promise<AuthToken> {
    try {
      logger.debug('Generating token pair for user', { userId: user.id }, 'JWT');

      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      const tokenPair: AuthToken = {
        accessToken,
        refreshToken,
        expiresIn: appConfig.tokenExpiration,
        tokenType: 'Bearer',
      };

      logger.info('Token pair generated successfully', { userId: user.id }, 'JWT');
      
      return tokenPair;
    } catch (error) {
      logger.error('Failed to generate token pair', error, 'JWT');
      throw new Error('Token pair generation failed');
    }
  }

  /**
   * Verifies and decodes a JWT token
   * @param token JWT token to verify
   * @returns Token verification result
   */
  public async verifyToken(token: string): Promise<TokenVerificationResult> {
    try {
      if (!token) {
        return {
          isValid: false,
          error: 'Token is required',
        };
      }

      logger.debug('Verifying JWT token', undefined, 'JWT');

      // Use simple mock token verification in development
      if (isDevelopment()) {
        return this.verifyMockToken(token);
      }

      const { payload } = await jwtVerify(token, this.secretKey, {
        issuer: this.issuer,
        audience: this.audience,
      });

      logger.debug('Token verified successfully', { userId: payload.userId }, 'JWT');

      return {
        isValid: true,
        payload: payload as CustomJWTPayload,
      };
    } catch (error: any) {
      logger.warn('Token verification failed', { error: error.message }, 'JWT');

      const isExpired = error.message?.includes('expired') || error.code === 'ERR_JWT_EXPIRED';

      return {
        isValid: false,
        error: error.message || 'Token verification failed',
        isExpired,
      };
    }
  }

  /**
   * Extracts payload from token without verification (use with caution)
   * @param token JWT token to decode
   * @returns Decoded payload or null
   */
  public decodeToken(token: string): CustomJWTPayload | null {
    try {
      if (!token) return null;

      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      
      logger.debug('Token decoded successfully', { userId: payload.userId }, 'JWT');
      
      return payload as CustomJWTPayload;
    } catch (error) {
      logger.warn('Failed to decode token', error, 'JWT');
      return null;
    }
  }

  /**
   * Checks if a token is expired
   * @param token JWT token to check
   * @returns True if token is expired
   */
  public isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < now - AUTH_CONSTANTS.TOKEN_EXPIRATION_BUFFER / 1000;

      if (isExpired) {
        logger.debug('Token is expired', { 
          expiration: new Date(payload.exp * 1000).toISOString(),
          now: new Date(now * 1000).toISOString(),
        }, 'JWT');
      }

      return isExpired;
    } catch (error) {
      logger.warn('Failed to check token expiration', error, 'JWT');
      return true;
    }
  }

  /**
   * Gets the expiration time of a token
   * @param token JWT token
   * @returns Expiration date or null
   */
  public getTokenExpiration(token: string): Date | null {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return null;

      return new Date(payload.exp * 1000);
    } catch (error) {
      logger.warn('Failed to get token expiration', error, 'JWT');
      return null;
    }
  }

  /**
   * Verifies a mock token for development
   * @param token Mock token to verify
   * @returns Token verification result
   */
  private verifyMockToken(token: string): TokenVerificationResult {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          isValid: false,
          error: 'Invalid token format',
        };
      }

      const payload = JSON.parse(atob(parts[1])) as CustomJWTPayload;
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        logger.debug('🧪 Mock token is expired', { 
          expiration: new Date(payload.exp * 1000).toISOString(),
        }, 'JWT');
        
        return {
          isValid: false,
          error: 'Token has expired',
          isExpired: true,
        };
      }

      logger.debug('🧪 Mock token verified successfully', { userId: payload.userId }, 'JWT');

      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      logger.warn('🧪 Mock token verification failed', error, 'JWT');
      return {
        isValid: false,
        error: 'Invalid mock token',
      };
    }
  }

  /**
   * Generates a simple mock access token for development (React Native compatible)
   * @param user User data to encode in token
   * @param additionalClaims Additional claims to include
   * @returns Simple base64 encoded mock token
   */
  private generateMockAccessToken(user: User, additionalClaims?: Record<string, any>): string {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = now + appConfig.tokenExpiration;

    const payload = {
      userId: user.id,
      email: user.email,
      role: 'user',
      sessionId: this.generateSessionId(),
      type: 'access',
      iat: now,
      exp: expirationTime,
      iss: this.issuer,
      aud: this.audience,
      sub: user.id,
      ...additionalClaims,
    };

    // Create a simple mock JWT structure: header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(`mock-signature-${user.id}-${now}`); // Simple mock signature

    const token = `${header}.${encodedPayload}.${signature}`;
    
    logger.info('🧪 Mock access token generated', { 
      userId: user.id, 
      expiresAt: new Date(expirationTime * 1000).toISOString(),
    }, 'JWT');
    
    return token;
  }

  /**
   * Generates a simple mock refresh token for development (React Native compatible)
   * @param user User data to encode in token
   * @returns Simple base64 encoded mock refresh token
   */
  private generateMockRefreshToken(user: User): string {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = now + (appConfig.tokenExpiration * 24 * 7); // 7 days

    const payload = {
      userId: user.id,
      email: user.email,
      type: 'refresh',
      sessionId: this.generateSessionId(),
      iat: now,
      exp: expirationTime,
      iss: this.issuer,
      aud: this.audience,
      sub: user.id,
    };

    // Create a simple mock JWT structure: header.payload.signature
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(`mock-refresh-signature-${user.id}-${now}`); // Simple mock signature

    const token = `${header}.${encodedPayload}.${signature}`;
    
    logger.info('🧪 Mock refresh token generated', { userId: user.id }, 'JWT');
    
    return token;
  }

  /**
   * Generates a unique session ID
   * @returns Random session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Refreshes an access token using a refresh token
   * @param refreshToken Valid refresh token
   * @param user Updated user data
   * @returns New access token
   */
  public async refreshAccessToken(refreshToken: string, user: User): Promise<string> {
    try {
      logger.debug('Refreshing access token', { userId: user.id }, 'JWT');

      const verification = await this.verifyToken(refreshToken);
      
      if (!verification.isValid || !verification.payload) {
        throw new Error('Invalid refresh token');
      }

      if (verification.payload.type !== 'refresh') {
        throw new Error('Token is not a refresh token');
      }

      if (verification.payload.userId !== user.id) {
        throw new Error('Token user mismatch');
      }

      const newAccessToken = await this.generateAccessToken(user);
      
      logger.info('Access token refreshed successfully', { userId: user.id }, 'JWT');
      
      return newAccessToken;
    } catch (error) {
      logger.error('Failed to refresh access token', error, 'JWT');
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Validates JWT secret key strength
   * @returns True if key meets security requirements
   */
  public validateSecretKey(): boolean {
    const key = appConfig.jwtSecretKey;
    
    if (!key || key.length < 32) {
      logger.warn('JWT secret key is too short (minimum 32 characters)', undefined, 'JWT');
      return false;
    }
    
    if (key === 'default-secret-key') {
      logger.warn('Using default JWT secret key is not secure', undefined, 'JWT');
      return false;
    }
    
    return true;
  }
}

/**
 * Singleton JWT utility instance
 */
export const jwtUtil = new JWTUtil();
