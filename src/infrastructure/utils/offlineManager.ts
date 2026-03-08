/**
 * @fileoverview Offline data management system for banking app
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import { logger } from './logger';

/**
 * Offline data entry interface
 */
interface OfflineDataEntry<T = any> {
  id: string;
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  priority: 'high' | 'medium' | 'low';
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  maxRetries: number;
  lastError?: string;
}

/**
 * Offline operation interface
 */
interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'medium' | 'low';
  lastError?: string;
}

/**
 * Offline manager configuration
 */
interface OfflineManagerConfig {
  maxCacheSize: number;
  defaultTTL: number; // Time to live in milliseconds
  maxRetries: number;
  syncInterval: number;
  storagePrefix: string;
}

/**
 * Network status
 */
interface NetworkStatus {
  isConnected: boolean;
  type: string | null;
  isInternetReachable: boolean | null;
}

/**
 * Enhanced Offline Manager
 * Provides comprehensive offline data caching, synchronization, and operation queuing
 */
class OfflineManager {
  private config: OfflineManagerConfig;
  private networkStatus: NetworkStatus;
  private syncInProgress: boolean = false;
  private syncQueue: OfflineOperation[] = [];
  private cache: Map<string, OfflineDataEntry> = new Map();
  private listeners: Set<(status: NetworkStatus) => void> = new Set();

  constructor(config: Partial<OfflineManagerConfig> = {}) {
    this.config = {
      maxCacheSize: 1000,
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      maxRetries: 3,
      syncInterval: 30 * 1000, // 30 seconds
      storagePrefix: 'offline_banking_',
      ...config,
    };

    this.networkStatus = {
      isConnected: false,
      type: null,
      isInternetReachable: null,
    };

    this.initialize();
  }

  /**
   * Initialize offline manager
   */
  private async initialize() {
    try {
      logger.info('📴 Initializing offline manager', this.config, 'OFFLINE_MANAGER');

      // Set up network listener
      NetInfo.addEventListener(this.handleNetworkChange);

      // Get initial network status
      const initialState = await NetInfo.fetch();
      this.handleNetworkChange(initialState);

      // Load cached data and sync queue
      await this.loadFromStorage();

      // Set up periodic sync
      this.setupPeriodicSync();

      logger.info('✅ Offline manager initialized', {
        cacheSize: this.cache.size,
        syncQueueSize: this.syncQueue.length,
        networkStatus: this.networkStatus,
      }, 'OFFLINE_MANAGER');

    } catch (error) {
      logger.error('❌ Failed to initialize offline manager', error, 'OFFLINE_MANAGER');
    }
  }

  /**
   * Handle network status changes
   */
  private handleNetworkChange = (state: NetInfoState) => {
    const previousStatus = this.networkStatus;
    this.networkStatus = {
      isConnected: state.isConnected ?? false,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    };

    logger.info('📡 Network status changed', {
      previous: previousStatus,
      current: this.networkStatus,
    }, 'OFFLINE_MANAGER');

    // Notify listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.networkStatus);
      } catch (error) {
        logger.error('❌ Error in network status listener', error, 'OFFLINE_MANAGER');
      }
    });

    // Start sync when coming online
    if (this.networkStatus.isConnected && !previousStatus.isConnected) {
      this.sync();
    }
  };

  /**
   * Add network status listener
   */
  addNetworkListener(listener: (status: NetworkStatus) => void) {
    this.listeners.add(listener);
    // Immediately call with current status
    listener(this.networkStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current network status
   */
  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  /**
   * Check if device is online
   */
  isOnline(): boolean {
    return this.networkStatus.isConnected && this.networkStatus.isInternetReachable !== false;
  }

  /**
   * Cache data with metadata
   */
  async cacheData<T>(
    key: string,
    data: T,
    options: {
      ttl?: number;
      priority?: 'high' | 'medium' | 'low';
      maxRetries?: number;
    } = {}
  ): Promise<void> {
    try {
      const entry: OfflineDataEntry<T> = {
        id: `cache_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key,
        data,
        timestamp: Date.now(),
        expiresAt: options.ttl ? Date.now() + options.ttl : Date.now() + this.config.defaultTTL,
        priority: options.priority || 'medium',
        syncStatus: 'synced',
        retryCount: 0,
        maxRetries: options.maxRetries || this.config.maxRetries,
      };

      this.cache.set(key, entry);

      // Cleanup old entries if cache is full
      await this.cleanupCache();

      // Persist to storage
      await this.saveToStorage();

      logger.debug('💾 Data cached', {
        key,
        dataSize: JSON.stringify(data).length,
        expiresAt: new Date(entry.expiresAt!),
      }, 'OFFLINE_MANAGER');

    } catch (error) {
      logger.error('❌ Failed to cache data', { key, error }, 'OFFLINE_MANAGER');
      throw error;
    }
  }

  /**
   * Retrieve cached data
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const entry = this.cache.get(key);

      if (!entry) {
        logger.debug('💾 Cache miss', { key }, 'OFFLINE_MANAGER');
        return null;
      }

      // Check if data has expired
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        await this.saveToStorage();
        logger.debug('💾 Cache expired', { key, expiresAt: new Date(entry.expiresAt) }, 'OFFLINE_MANAGER');
        return null;
      }

      logger.debug('💾 Cache hit', { 
        key, 
        age: Date.now() - entry.timestamp,
        expiresIn: entry.expiresAt ? entry.expiresAt - Date.now() : null,
      }, 'OFFLINE_MANAGER');

      return entry.data;

    } catch (error) {
      logger.error('❌ Failed to retrieve cached data', { key, error }, 'OFFLINE_MANAGER');
      return null;
    }
  }

  /**
   * Queue offline operation
   */
  async queueOperation(
    type: 'create' | 'update' | 'delete',
    endpoint: string,
    data: any,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<string> {
    try {
      const operation: OfflineOperation = {
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        endpoint,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: this.config.maxRetries,
        priority,
      };

      // Insert based on priority
      const insertIndex = this.syncQueue.findIndex(op => 
        this.getPriorityValue(op.priority) < this.getPriorityValue(priority)
      );

      if (insertIndex === -1) {
        this.syncQueue.push(operation);
      } else {
        this.syncQueue.splice(insertIndex, 0, operation);
      }

      await this.saveToStorage();

      logger.info('📝 Operation queued', {
        id: operation.id,
        type,
        endpoint,
        priority,
        queueSize: this.syncQueue.length,
      }, 'OFFLINE_MANAGER');

      // Try to sync immediately if online
      if (this.isOnline()) {
        this.sync();
      }

      return operation.id;

    } catch (error) {
      logger.error('❌ Failed to queue operation', { type, endpoint, error }, 'OFFLINE_MANAGER');
      throw error;
    }
  }

  /**
   * Get priority numeric value for sorting
   */
  private getPriorityValue(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  /**
   * Sync queued operations
   */
  async sync(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline()) {
      logger.warn('📴 Cannot sync - device is offline', undefined, 'OFFLINE_MANAGER');
      return { success: 0, failed: 0 };
    }

    if (this.syncInProgress) {
      logger.debug('🔄 Sync already in progress', undefined, 'OFFLINE_MANAGER');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let successCount = 0;
    let failedCount = 0;

    try {
      logger.info('🔄 Starting sync', { queueSize: this.syncQueue.length }, 'OFFLINE_MANAGER');

      const operations = [...this.syncQueue];
      
      for (const operation of operations) {
        try {
          await this.syncOperation(operation);
          
          // Remove from queue on success
          const index = this.syncQueue.findIndex(op => op.id === operation.id);
          if (index !== -1) {
            this.syncQueue.splice(index, 1);
          }
          
          successCount++;
          
        } catch (error) {
          logger.error('❌ Operation sync failed', {
            operationId: operation.id,
            error: error instanceof Error ? error.message : error,
          }, 'OFFLINE_MANAGER');

          // Update retry count
          operation.retryCount++;
          operation.lastError = error instanceof Error ? error.message : String(error);

          // Remove if max retries reached
          if (operation.retryCount >= operation.maxRetries) {
            const index = this.syncQueue.findIndex(op => op.id === operation.id);
            if (index !== -1) {
              this.syncQueue.splice(index, 1);
            }
            logger.warn('🚫 Operation removed - max retries reached', {
              operationId: operation.id,
              maxRetries: operation.maxRetries,
            }, 'OFFLINE_MANAGER');
          }

          failedCount++;
        }
      }

      await this.saveToStorage();

      logger.info('✅ Sync completed', { 
        success: successCount, 
        failed: failedCount,
        remaining: this.syncQueue.length,
      }, 'OFFLINE_MANAGER');

    } catch (error) {
      logger.error('❌ Sync process failed', error, 'OFFLINE_MANAGER');
    } finally {
      this.syncInProgress = false;
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Sync individual operation
   */
  private async syncOperation(operation: OfflineOperation): Promise<void> {
    // In a real implementation, this would make actual API calls
    // For now, we'll simulate the sync
    
    logger.info('🔄 Syncing operation', {
      id: operation.id,
      type: operation.type,
      endpoint: operation.endpoint,
    }, 'OFFLINE_MANAGER');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate random failures for testing
    if (Math.random() < 0.1) {
      throw new Error('Simulated sync failure');
    }
  }

  /**
   * Clean up expired cache entries
   */
  private async cleanupCache(): Promise<void> {
    const now = Date.now();
    let cleanedCount = 0;

    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    // Remove oldest entries if cache is still too large
    if (this.cache.size > this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = this.cache.size - this.config.maxCacheSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug('🧹 Cache cleanup completed', {
        entriesRemoved: cleanedCount,
        currentSize: this.cache.size,
      }, 'OFFLINE_MANAGER');
    }
  }

  /**
   * Set up periodic sync
   */
  private setupPeriodicSync(): void {
    setInterval(() => {
      if (this.isOnline() && this.syncQueue.length > 0) {
        this.sync();
      }
    }, this.config.syncInterval);
  }

  /**
   * Save data to persistent storage
   */
  private async saveToStorage(): Promise<void> {
    try {
      const cacheData = Array.from(this.cache.entries());
      const storageData = {
        cache: cacheData,
        syncQueue: this.syncQueue,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        `${this.config.storagePrefix}data`,
        JSON.stringify(storageData)
      );

    } catch (error) {
      logger.error('❌ Failed to save to storage', error, 'OFFLINE_MANAGER');
    }
  }

  /**
   * Load data from persistent storage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const storedData = await AsyncStorage.getItem(`${this.config.storagePrefix}data`);
      
      if (storedData) {
        const { cache, syncQueue } = JSON.parse(storedData);
        
        // Restore cache
        this.cache = new Map(cache);
        
        // Restore sync queue
        this.syncQueue = syncQueue || [];
        
        // Clean up expired entries
        await this.cleanupCache();
        
        logger.info('📦 Data loaded from storage', {
          cacheSize: this.cache.size,
          syncQueueSize: this.syncQueue.length,
        }, 'OFFLINE_MANAGER');
      }

    } catch (error) {
      logger.error('❌ Failed to load from storage', error, 'OFFLINE_MANAGER');
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      this.cache.clear();
      await AsyncStorage.removeItem(`${this.config.storagePrefix}data`);
      logger.info('🧹 Cache cleared', undefined, 'OFFLINE_MANAGER');
    } catch (error) {
      logger.error('❌ Failed to clear cache', error, 'OFFLINE_MANAGER');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    
    return {
      totalEntries: entries.length,
      expiredEntries: entries.filter(entry => entry.expiresAt && now > entry.expiresAt).length,
      syncQueueSize: this.syncQueue.length,
      priorities: {
        high: entries.filter(entry => entry.priority === 'high').length,
        medium: entries.filter(entry => entry.priority === 'medium').length,
        low: entries.filter(entry => entry.priority === 'low').length,
      },
      syncStatuses: {
        pending: entries.filter(entry => entry.syncStatus === 'pending').length,
        syncing: entries.filter(entry => entry.syncStatus === 'syncing').length,
        synced: entries.filter(entry => entry.syncStatus === 'synced').length,
        failed: entries.filter(entry => entry.syncStatus === 'failed').length,
      },
      networkStatus: this.networkStatus,
    };
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();

// Export types for use in other files
export type { NetworkStatus, OfflineDataEntry, OfflineOperation };

console.log(' Offline manager initialized');

export default offlineManager;
