/**
 * @fileoverview Inactivity management utility for automatic session handling
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { appConfig } from '../config/app.config';
import { logger } from './logger';
import { STORAGE_KEYS } from '../../shared/constants';

/**
 * Inactivity event types
 */
export type InactivityEvent = 
  | 'warning' 
  | 'timeout' 
  | 'background' 
  | 'foreground' 
  | 'activity';

/**
 * Inactivity callback function type
 */
export type InactivityCallback = (event: InactivityEvent, data?: any) => void;

/**
 * Inactivity manager configuration
 */
interface InactivityConfig {
  timeout: number;
  warningTime: number;
  checkInterval: number;
  enableBackgroundTimeout: boolean;
}

/**
 * Inactivity manager class for handling user session timeouts
 */
class InactivityManager {
  private readonly config: InactivityConfig;
  private lastActivity: number;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private checkTimer: NodeJS.Timeout | null = null;
  private callbacks: Map<string, InactivityCallback> = new Map();
  private isActive: boolean = true;
  private appStateSubscription: any = null;

  constructor() {
    this.config = {
      timeout: appConfig.inactivityTimeout,
      warningTime: appConfig.inactivityTimeout - 60000, // 1 minute before timeout
      checkInterval: 30000, // Check every 30 seconds
      enableBackgroundTimeout: true,
    };
    
    this.lastActivity = Date.now();
    this.init();
  }

  /**
   * Initializes the inactivity manager
   */
  private init(): void {
    logger.info('Initializing inactivity manager', {
      timeout: this.config.timeout,
      warningTime: this.config.warningTime,
    }, 'INACTIVITY');

    this.setupAppStateListener();
    this.loadLastActivity();
    this.startChecking();
  }

  /**
   * Sets up app state change listener
   */
  private setupAppStateListener(): void {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this)
    );
    
    logger.debug('App state listener initialized', undefined, 'INACTIVITY');
  }

  /**
   * Handles app state changes (background/foreground)
   * @param nextAppState Next app state
   */
  private handleAppStateChange(nextAppState: AppStateStatus): void {
    logger.debug('App state changed', { 
      previous: this.isActive ? 'active' : 'inactive',
      next: nextAppState,
    }, 'INACTIVITY');

    if (nextAppState === 'active') {
      this.handleForeground();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.handleBackground();
    }
  }

  /**
   * Handles app going to foreground
   */
  private handleForeground(): void {
    logger.info('App returned to foreground', undefined, 'INACTIVITY');
    
    this.isActive = true;
    this.notifyCallbacks('foreground');
    
    // Check if session expired while in background
    this.checkInactivity();
    this.startChecking();
  }

  /**
   * Handles app going to background
   */
  private handleBackground(): void {
    logger.info('App moved to background', undefined, 'INACTIVITY');
    
    this.isActive = false;
    this.saveLastActivity();
    this.notifyCallbacks('background');
    
    if (this.config.enableBackgroundTimeout) {
      this.startInactivityTimer();
    } else {
      this.stopChecking();
    }
  }

  /**
   * Records user activity
   */
  public recordActivity(): void {
    if (!this.isActive) return;

    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;

    // Only log if it's been more than 10 seconds since last activity
    if (timeSinceLastActivity > 10000) {
      logger.debug('User activity recorded', { 
        timeSinceLastActivity,
        lastActivity: new Date(this.lastActivity).toISOString(),
      }, 'INACTIVITY');
    }

    this.lastActivity = now;
    this.clearTimers();
    this.startInactivityTimer();
    this.saveLastActivity();
    
    this.notifyCallbacks('activity', { timestamp: now });
  }

  /**
   * Starts the inactivity timer
   */
  private startInactivityTimer(): void {
    this.clearTimers();
    
    // Set warning timer
    const warningDelay = Math.max(0, this.config.warningTime - (Date.now() - this.lastActivity));
    if (warningDelay > 0) {
      this.warningTimer = setTimeout(() => {
        logger.warn('Inactivity warning triggered', {
          lastActivity: new Date(this.lastActivity).toISOString(),
          timeUntilTimeout: this.config.timeout - this.config.warningTime,
        }, 'INACTIVITY');
        
        this.notifyCallbacks('warning', {
          timeRemaining: this.config.timeout - this.config.warningTime,
        });
      }, warningDelay);
    }

    // Set timeout timer
    const timeoutDelay = Math.max(0, this.config.timeout - (Date.now() - this.lastActivity));
    if (timeoutDelay > 0) {
      this.inactivityTimer = setTimeout(() => {
        logger.warn('Inactivity timeout reached', {
          lastActivity: new Date(this.lastActivity).toISOString(),
          timeoutDuration: this.config.timeout,
        }, 'INACTIVITY');
        
        this.handleTimeout();
      }, timeoutDelay);
    } else {
      // Already timed out
      this.handleTimeout();
    }
  }

  /**
   * Starts the periodic activity check
   */
  private startChecking(): void {
    if (this.checkTimer) return;

    this.checkTimer = setInterval(() => {
      this.checkInactivity();
    }, this.config.checkInterval);
    
    logger.debug('Started inactivity checking', { interval: this.config.checkInterval }, 'INACTIVITY');
  }

  /**
   * Stops all timers and checking
   */
  private stopChecking(): void {
    this.clearTimers();
    
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
    
    logger.debug('Stopped inactivity checking', undefined, 'INACTIVITY');
  }

  /**
   * Clears all timers
   */
  private clearTimers(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  /**
   * Checks current inactivity status
   */
  private checkInactivity(): void {
    const now = Date.now();
    const inactiveTime = now - this.lastActivity;
    
    if (inactiveTime >= this.config.timeout) {
      this.handleTimeout();
    } else if (inactiveTime >= this.config.warningTime && this.isActive) {
      this.notifyCallbacks('warning', {
        timeRemaining: this.config.timeout - inactiveTime,
      });
    }
  }

  /**
   * Handles inactivity timeout
   */
  private handleTimeout(): void {
    logger.warn('Session timed out due to inactivity', {
      lastActivity: new Date(this.lastActivity).toISOString(),
      inactiveTime: Date.now() - this.lastActivity,
    }, 'INACTIVITY');

    this.clearTimers();
    this.stopChecking();
    this.notifyCallbacks('timeout');
  }

  /**
   * Loads last activity from storage
   */
  private async loadLastActivity(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      if (stored) {
        this.lastActivity = parseInt(stored, 10);
        logger.debug('Loaded last activity from storage', {
          lastActivity: new Date(this.lastActivity).toISOString(),
        }, 'INACTIVITY');
      }
    } catch (error) {
      logger.error('Failed to load last activity from storage', error, 'INACTIVITY');
    }
  }

  /**
   * Saves current activity timestamp to storage
   */
  private async saveLastActivity(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, this.lastActivity.toString());
    } catch (error) {
      logger.error('Failed to save last activity to storage', error, 'INACTIVITY');
    }
  }

  /**
   * Registers a callback for inactivity events
   * @param id Unique callback identifier
   * @param callback Callback function
   */
  public onInactivityEvent(id: string, callback: InactivityCallback): void {
    this.callbacks.set(id, callback);
    logger.debug('Registered inactivity callback', { id }, 'INACTIVITY');
  }

  /**
   * Unregisters a callback
   * @param id Callback identifier to remove
   */
  public removeInactivityCallback(id: string): void {
    this.callbacks.delete(id);
    logger.debug('Removed inactivity callback', { id }, 'INACTIVITY');
  }

  /**
   * Notifies all registered callbacks
   * @param event Event type
   * @param data Additional event data
   */
  private notifyCallbacks(event: InactivityEvent, data?: any): void {
    logger.debug('Notifying inactivity callbacks', { event, callbackCount: this.callbacks.size }, 'INACTIVITY');
    
    this.callbacks.forEach((callback, id) => {
      try {
        callback(event, data);
      } catch (error) {
        logger.error('Callback error', error, 'INACTIVITY');
      }
    });
  }

  /**
   * Resets the inactivity timer (extends session)
   */
  public resetTimer(): void {
    logger.debug('Manually resetting inactivity timer', undefined, 'INACTIVITY');
    this.recordActivity();
  }

  /**
   * Gets time remaining until timeout
   * @returns Time remaining in milliseconds
   */
  public getTimeRemaining(): number {
    const now = Date.now();
    const elapsed = now - this.lastActivity;
    return Math.max(0, this.config.timeout - elapsed);
  }

  /**
   * Gets time remaining until warning
   * @returns Time remaining until warning in milliseconds
   */
  public getTimeUntilWarning(): number {
    const now = Date.now();
    const elapsed = now - this.lastActivity;
    return Math.max(0, this.config.warningTime - elapsed);
  }

  /**
   * Checks if session is currently timed out
   * @returns True if session is timed out
   */
  public isTimedOut(): boolean {
    const now = Date.now();
    const elapsed = now - this.lastActivity;
    return elapsed >= this.config.timeout;
  }

  /**
   * Updates configuration
   * @param newConfig Partial configuration to update
   */
  public updateConfig(newConfig: Partial<InactivityConfig>): void {
    Object.assign(this.config, newConfig);
    logger.info('Inactivity configuration updated', newConfig, 'INACTIVITY');
    
    // Restart with new configuration
    this.stopChecking();
    this.startChecking();
  }

  /**
   * Destroys the inactivity manager
   */
  public destroy(): void {
    logger.info('Destroying inactivity manager', undefined, 'INACTIVITY');
    
    this.stopChecking();
    this.callbacks.clear();
    
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }
}

/**
 * Singleton inactivity manager instance
 */
export const inactivityManager = new InactivityManager();
