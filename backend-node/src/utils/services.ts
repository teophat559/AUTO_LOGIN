import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { configManager } from './config';
import { redisManager } from './redis';
import { dbManager } from './database';
import { queueManager } from './queue';
import { wsManager } from './websocket';
import { notificationManager } from './notification';

// Service options
export interface ServiceOptions {
  name: string;
  enabled: boolean;
  timeout: number;
  maxRetries: number;
  keepAlive: boolean;
  metadata?: Record<string, any>;
}

// Service class
class ServiceManager extends EventEmitter {
  private static instance: ServiceManager;
  private services: Map<string, any>;
  private options: Map<string, ServiceOptions>;

  private constructor() {
    super();
    this.services = new Map();
    this.options = new Map();
  }

  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  // Register service
  public registerService<T>(
    name: string,
    service: T,
    options: ServiceOptions
  ): void {
    try {
      if (this.services.has(name)) {
        throw new AppError(`Service already exists: ${name}`, HTTP_STATUS.CONFLICT);
      }

      this.services.set(name, service);
      this.options.set(name, options);

      logger.info('Service registered', { name, options });
      this.emit('service:registered', { name, options });
    } catch (error) {
      logger.error('Error registering service:', error);
      throw error;
    }
  }

  // Get service
  public getService<T>(name: string): T {
    try {
      const service = this.services.get(name);
      if (!service) {
        throw new AppError(`Service not found: ${name}`, HTTP_STATUS.NOT_FOUND);
      }
      return service as T;
    } catch (error) {
      logger.error('Error getting service:', error);
      throw error;
    }
  }

  // Get service options
  public getServiceOptions(name: string): ServiceOptions {
    try {
      const options = this.options.get(name);
      if (!options) {
        throw new AppError(`Service options not found: ${name}`, HTTP_STATUS.NOT_FOUND);
      }
      return options;
    } catch (error) {
      logger.error('Error getting service options:', error);
      throw error;
    }
  }

  // Remove service
  public removeService(name: string): void {
    try {
      if (!this.services.has(name)) {
        throw new AppError(`Service not found: ${name}`, HTTP_STATUS.NOT_FOUND);
      }

      this.services.delete(name);
      this.options.delete(name);

      logger.info('Service removed', { name });
      this.emit('service:removed', { name });
    } catch (error) {
      logger.error('Error removing service:', error);
      throw error;
    }
  }

  // Get all services
  public getAllServices(): Map<string, any> {
    return new Map(this.services);
  }

  // Get all service options
  public getAllServiceOptions(): Map<string, ServiceOptions> {
    return new Map(this.options);
  }

  // Initialize services
  public async initializeServices(): Promise<void> {
    try {
      // Initialize database
      const dbOptions = this.getServiceOptions('database');
      if (dbOptions.enabled) {
        await dbManager.checkConnection();
      }

      // Initialize Redis
      const redisOptions = this.getServiceOptions('redis');
      if (redisOptions.enabled) {
        await redisManager.getInfo();
      }

      // Initialize queue
      const queueOptions = this.getServiceOptions('queue');
      if (queueOptions.enabled) {
        await queueManager.getStats();
      }

      // Initialize WebSocket
      const wsOptions = this.getServiceOptions('websocket');
      if (wsOptions.enabled) {
        await wsManager.getInfo();
      }

      // Initialize notification
      const notificationOptions = this.getServiceOptions('notification');
      if (notificationOptions.enabled) {
        await notificationManager.getInfo();
      }

      logger.info('Services initialized');
      this.emit('services:initialized');
    } catch (error) {
      logger.error('Error initializing services:', error);
      throw error;
    }
  }

  // Close services
  public async closeServices(): Promise<void> {
    try {
      // Close database
      const dbOptions = this.getServiceOptions('database');
      if (dbOptions.enabled) {
        await dbManager.close();
      }

      // Close Redis
      const redisOptions = this.getServiceOptions('redis');
      if (redisOptions.enabled) {
        await redisManager.close();
      }

      // Close queue
      const queueOptions = this.getServiceOptions('queue');
      if (queueOptions.enabled) {
        await queueManager.close();
      }

      // Close WebSocket
      const wsOptions = this.getServiceOptions('websocket');
      if (wsOptions.enabled) {
        await wsManager.close();
      }

      // Close notification
      const notificationOptions = this.getServiceOptions('notification');
      if (notificationOptions.enabled) {
        await notificationManager.close();
      }

      logger.info('Services closed');
      this.emit('services:closed');
    } catch (error) {
      logger.error('Error closing services:', error);
      throw error;
    }
  }

  // Get service status
  public async getServiceStatus(name: string): Promise<{
    name: string;
    enabled: boolean;
    status: string;
    metadata?: Record<string, any>;
  }> {
    try {
      const options = this.getServiceOptions(name);
      const service = this.getService(name);

      let status = 'unknown';
      let metadata: Record<string, any> | undefined;

      switch (name) {
        case 'database':
          status = await dbManager.checkConnection() ? 'connected' : 'disconnected';
          metadata = await dbManager.getStats();
          break;
        case 'redis':
          status = 'connected';
          metadata = await redisManager.getInfo();
          break;
        case 'queue':
          status = 'running';
          metadata = await queueManager.getStats();
          break;
        case 'websocket':
          status = 'running';
          metadata = await wsManager.getInfo();
          break;
        case 'notification':
          status = 'running';
          metadata = await notificationManager.getInfo();
          break;
      }

      return {
        name,
        enabled: options.enabled,
        status,
        metadata
      };
    } catch (error) {
      logger.error('Error getting service status:', error);
      throw error;
    }
  }

  // Get all service statuses
  public async getAllServiceStatuses(): Promise<{
    name: string;
    enabled: boolean;
    status: string;
    metadata?: Record<string, any>;
  }[]> {
    try {
      const statuses = [];
      for (const name of this.services.keys()) {
        const status = await this.getServiceStatus(name);
        statuses.push(status);
      }
      return statuses;
    } catch (error) {
      logger.error('Error getting all service statuses:', error);
      throw error;
    }
  }
}

export const serviceManager = ServiceManager.getInstance();