import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';

// Cache options
export interface CacheOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  defaultTTL?: number;
}

// Cache item
export interface CacheItem<T = any> {
  key: string;
  value: T;
  ttl: number;
  timestamp: number;
  metadata?: {
    type?: string;
    category?: string;
    tags?: string[];
  };
}

// Cache class
class CacheManager extends EventEmitter {
  private static instance: CacheManager;
  private client: Redis;
  private options: CacheOptions;
  private memoryCache: Map<string, CacheItem>;

  private constructor(options: CacheOptions = {}) {
    super();
    this.options = {
      host: options.host || process.env.REDIS_HOST || 'localhost',
      port: options.port || parseInt(process.env.REDIS_PORT || '6379'),
      password: options.password || process.env.REDIS_PASSWORD,
      db: options.db || parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: options.keyPrefix || 'cache:',
      defaultTTL: options.defaultTTL || 3600
    };

    this.client = new Redis({
      host: this.options.host,
      port: this.options.port,
      password: this.options.password,
      db: this.options.db,
      keyPrefix: this.options.keyPrefix
    });

    this.memoryCache = new Map();
    this.setupRedisEvents();
  }

  public static getInstance(options?: CacheOptions): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(options);
    }
    return CacheManager.instance;
  }

  // Set cache
  public async set<T>(
    key: string,
    value: T,
    ttl: number = this.options.defaultTTL!,
    metadata?: CacheItem['metadata']
  ): Promise<void> {
    try {
      const item: CacheItem<T> = {
        key,
        value,
        ttl,
        timestamp: Date.now(),
        metadata
      };

      const serialized = JSON.stringify(item);
      await this.client.set(key, serialized, 'EX', ttl);
      this.memoryCache.set(key, item);
      this.emit('cache:set', { key, ttl, metadata });
    } catch (error) {
      logger.error('Error setting cache:', error);
      throw new AppError('Error setting cache', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache
  public async get<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      const memoryItem = this.memoryCache.get(key);
      if (memoryItem) {
        if (this.isExpired(memoryItem)) {
          this.memoryCache.delete(key);
        } else {
          return memoryItem.value as T;
        }
      }

      // Check Redis cache
      const serialized = await this.client.get(key);
      if (!serialized) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(serialized);
      if (this.isExpired(item)) {
        await this.del(key);
        return null;
      }

      this.memoryCache.set(key, item);
      return item.value;
    } catch (error) {
      logger.error('Error getting cache:', error);
      throw new AppError('Error getting cache', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete cache
  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
      this.memoryCache.delete(key);
      this.emit('cache:del', { key });
    } catch (error) {
      logger.error('Error deleting cache:', error);
      throw new AppError('Error deleting cache', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Clear cache
  public async clear(pattern: string = '*'): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
        for (const key of keys) {
          this.memoryCache.delete(key);
        }
      }
      this.emit('cache:clear', { pattern });
    } catch (error) {
      logger.error('Error clearing cache:', error);
      throw new AppError('Error clearing cache', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache keys
  public async keys(pattern: string = '*'): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error('Error getting cache keys:', error);
      throw new AppError('Error getting cache keys', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache size
  public async size(): Promise<number> {
    try {
      return await this.client.dbsize();
    } catch (error) {
      logger.error('Error getting cache size:', error);
      throw new AppError('Error getting cache size', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache info
  public async info(): Promise<Redis.Info> {
    try {
      return await this.client.info();
    } catch (error) {
      logger.error('Error getting cache info:', error);
      throw new AppError('Error getting cache info', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache stats
  public async stats(): Promise<{
    size: number;
    keys: string[];
    memory: number;
    hits: number;
    misses: number;
  }> {
    try {
      const [size, keys, info] = await Promise.all([
        this.size(),
        this.keys(),
        this.info()
      ]);

      const memory = parseInt(info.split('\r\n').find(line => line.startsWith('used_memory:'))?.split(':')[1] || '0');
      const hits = parseInt(info.split('\r\n').find(line => line.startsWith('keyspace_hits:'))?.split(':')[1] || '0');
      const misses = parseInt(info.split('\r\n').find(line => line.startsWith('keyspace_misses:'))?.split(':')[1] || '0');

      return { size, keys, memory, hits, misses };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      throw new AppError('Error getting cache stats', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Check if cache exists
  public async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      logger.error('Error checking cache existence:', error);
      throw new AppError('Error checking cache existence', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache TTL
  public async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error('Error getting cache TTL:', error);
      throw new AppError('Error getting cache TTL', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Set cache TTL
  public async setTTL(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
      const item = this.memoryCache.get(key);
      if (item) {
        item.ttl = ttl;
        item.timestamp = Date.now();
      }
      this.emit('cache:ttl', { key, ttl });
    } catch (error) {
      logger.error('Error setting cache TTL:', error);
      throw new AppError('Error setting cache TTL', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Setup Redis events
  private setupRedisEvents(): void {
    this.client.on('connect', () => {
      logger.info('Redis connected');
      this.emit('redis:connect');
    });

    this.client.on('error', (error) => {
      logger.error('Redis error:', error);
      this.emit('redis:error', error);
    });

    this.client.on('close', () => {
      logger.info('Redis connection closed');
      this.emit('redis:close');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting');
      this.emit('redis:reconnecting');
    });
  }

  // Check if cache item is expired
  private isExpired(item: CacheItem): boolean {
    return Date.now() - item.timestamp > item.ttl * 1000;
  }

  // Close Redis connection
  public async close(): Promise<void> {
    try {
      await this.client.quit();
      this.memoryCache.clear();
      this.emit('redis:close');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
      throw new AppError('Error closing Redis connection', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export const cacheManager = CacheManager.getInstance();
