import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';

// Redis options
export interface RedisOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  retryStrategy?: (times: number) => number | null;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  connectTimeout?: number;
  commandTimeout?: number;
}

// Cache options
export interface CacheOptions {
  ttl?: number;
  prefix?: string;
  serialize?: boolean;
}

// Redis class
class RedisManager extends EventEmitter {
  private static instance: RedisManager;
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;
  private options: RedisOptions;
  private defaultTTL: number;

  private constructor(options: RedisOptions = {}) {
    super();
    this.options = {
      host: options.host || process.env.REDIS_HOST || 'localhost',
      port: options.port || parseInt(process.env.REDIS_PORT || '6379'),
      password: options.password || process.env.REDIS_PASSWORD,
      db: options.db || parseInt(process.env.REDIS_DB || '0'),
      keyPrefix: options.keyPrefix || process.env.REDIS_PREFIX || 'app:',
      retryStrategy: options.retryStrategy || ((times: number) => Math.min(times * 50, 2000)),
      maxRetriesPerRequest: options.maxRetriesPerRequest || 3,
      enableReadyCheck: options.enableReadyCheck || true,
      connectTimeout: options.connectTimeout || 10000,
      commandTimeout: options.commandTimeout || 5000
    };

    this.defaultTTL = parseInt(process.env.REDIS_DEFAULT_TTL || '3600');
    this.client = new Redis(this.options);
    this.subscriber = new Redis(this.options);
    this.publisher = new Redis(this.options);
    this.setupEvents();
  }

  public static getInstance(options?: RedisOptions): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager(options);
    }
    return RedisManager.instance;
  }

  // Setup events
  private setupEvents(): void {
    this.client.on('connect', () => {
      logger.info('Redis connected');
      this.emit('redis:connect');
    });

    this.client.on('error', (error: Error) => {
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

    this.subscriber.on('message', (channel: string, message: string) => {
      this.emit('redis:message', { channel, message });
    });
  }

  // Set value
  public async set(
    key: string,
    value: any,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const serialized = options.serialize ? JSON.stringify(value) : value;
      const ttl = options.ttl || this.defaultTTL;
      const prefixedKey = this.getPrefixedKey(key, options.prefix);

      if (ttl > 0) {
        await this.client.setex(prefixedKey, ttl, serialized);
      } else {
        await this.client.set(prefixedKey, serialized);
      }

      this.emit('redis:set', { key: prefixedKey, ttl });
    } catch (error) {
      logger.error('Error setting Redis value:', error);
      throw new AppError('Error setting Redis value', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get value
  public async get<T = any>(
    key: string,
    options: CacheOptions = {}
  ): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const value = await this.client.get(prefixedKey);

      if (!value) {
        return null;
      }

      return options.serialize ? JSON.parse(value) : value;
    } catch (error) {
      logger.error('Error getting Redis value:', error);
      throw new AppError('Error getting Redis value', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete value
  public async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      await this.client.del(prefixedKey);
      this.emit('redis:del', { key: prefixedKey });
    } catch (error) {
      logger.error('Error deleting Redis value:', error);
      throw new AppError('Error deleting Redis value', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Check if key exists
  public async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const result = await this.client.exists(prefixedKey);
      return result === 1;
    } catch (error) {
      logger.error('Error checking Redis key:', error);
      throw new AppError('Error checking Redis key', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get TTL
  public async ttl(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      return await this.client.ttl(prefixedKey);
    } catch (error) {
      logger.error('Error getting Redis TTL:', error);
      throw new AppError('Error getting Redis TTL', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Set TTL
  public async expire(key: string, ttl: number, options: CacheOptions = {}): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      await this.client.expire(prefixedKey, ttl);
      this.emit('redis:expire', { key: prefixedKey, ttl });
    } catch (error) {
      logger.error('Error setting Redis TTL:', error);
      throw new AppError('Error setting Redis TTL', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Subscribe to channel
  public async subscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.subscribe(channel);
      this.emit('redis:subscribe', { channel });
    } catch (error) {
      logger.error('Error subscribing to Redis channel:', error);
      throw new AppError('Error subscribing to Redis channel', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Unsubscribe from channel
  public async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
      this.emit('redis:unsubscribe', { channel });
    } catch (error) {
      logger.error('Error unsubscribing from Redis channel:', error);
      throw new AppError('Error unsubscribing from Redis channel', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Publish to channel
  public async publish(channel: string, message: any): Promise<void> {
    try {
      const serialized = typeof message === 'string' ? message : JSON.stringify(message);
      await this.publisher.publish(channel, serialized);
      this.emit('redis:publish', { channel, message });
    } catch (error) {
      logger.error('Error publishing to Redis channel:', error);
      throw new AppError('Error publishing to Redis channel', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get prefixed key
  private getPrefixedKey(key: string, prefix?: string): string {
    return `${this.options.keyPrefix}${prefix ? prefix + ':' : ''}${key}`;
  }

  // Get client info
  public async getInfo(): Promise<any> {
    try {
      return await this.client.info();
    } catch (error) {
      logger.error('Error getting Redis info:', error);
      throw new AppError('Error getting Redis info', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Close connections
  public async close(): Promise<void> {
    try {
      await this.client.quit();
      await this.subscriber.quit();
      await this.publisher.quit();
      this.emit('redis:closed');
    } catch (error) {
      logger.error('Error closing Redis connections:', error);
      throw new AppError('Error closing Redis connections', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export const redisManager = RedisManager.getInstance();