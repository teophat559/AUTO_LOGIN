import { Pool, PoolClient, QueryResult } from 'pg';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { CacheService } from '../services/CacheService';

// Database options
export interface DatabaseOptions {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
  max?: number;
  min?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Query options
export interface QueryOptions {
  cache?: boolean;
  cacheTTL?: number;
  transaction?: boolean;
  timeout?: number;
  params?: any[];
}

// Query result
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
  fields: any[];
  duration: number;
}

// Database class
class DatabaseManager extends EventEmitter {
  private static instance: DatabaseManager;
  private pool: Pool;
  private options: DatabaseOptions;
  private cacheService: CacheService;
  private transactionClient: PoolClient | null;

  private constructor(options: DatabaseOptions = {}) {
    super();
    this.options = {
      host: options.host || process.env.DB_HOST || 'localhost',
      port: options.port || parseInt(process.env.DB_PORT || '5432'),
      database: options.database || process.env.DB_NAME,
      user: options.user || process.env.DB_USER,
      password: options.password || process.env.DB_PASSWORD,
      ssl: options.ssl || process.env.DB_SSL === 'true',
      max: options.max || parseInt(process.env.DB_POOL_MAX || '20'),
      min: options.min || parseInt(process.env.DB_POOL_MIN || '4'),
      idleTimeoutMillis: options.idleTimeoutMillis || parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: options.connectionTimeoutMillis || parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000')
    };

    this.pool = new Pool(this.options);
    this.cacheService = CacheService.getInstance();
    this.transactionClient = null;
    this.setupPoolEvents();
  }

  public static getInstance(options?: DatabaseOptions): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(options);
    }
    return DatabaseManager.instance;
  }

  // Setup pool events
  private setupPoolEvents(): void {
    this.pool.on('connect', (client: PoolClient) => {
      logger.info('Database connected');
      this.emit('db:connect', { clientId: client.processID });
    });

    this.pool.on('error', (error: Error, client: PoolClient) => {
      logger.error('Database error:', error);
      this.emit('db:error', { clientId: client.processID, error });
    });

    this.pool.on('acquire', (client: PoolClient) => {
      logger.info('Client acquired:', client.processID);
      this.emit('db:acquire', { clientId: client.processID });
    });

    this.pool.on('remove', (client: PoolClient) => {
      logger.info('Client removed:', client.processID);
      this.emit('db:remove', { clientId: client.processID });
    });
  }

  // Execute query
  public async query<T = any>(
    text: string,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    try {
      const startTime = Date.now();
      const cacheKey = this.getCacheKey(text, options.params);

      if (options.cache) {
        const cached = await this.cacheService.get<QueryResult<T>>(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const client = options.transaction ? this.transactionClient! : await this.pool.connect();
      const result = await client.query(text, options.params);
      const duration = Date.now() - startTime;

      const queryResult: QueryResult<T> = {
        rows: result.rows,
        rowCount: result.rowCount,
        command: result.command,
        fields: result.fields,
        duration
      };

      if (options.cache) {
        await this.cacheService.set(cacheKey, queryResult, options.cacheTTL);
      }

      if (!options.transaction) {
        client.release();
      }

      this.emit('query:executed', {
        text,
        params: options.params,
        duration,
        rowCount: result.rowCount
      });

      return queryResult;
    } catch (error) {
      logger.error('Error executing query:', error);
      throw new AppError('Error executing query', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Start transaction
  public async beginTransaction(): Promise<void> {
    try {
      if (this.transactionClient) {
        throw new AppError('Transaction already started', HTTP_STATUS.CONFLICT);
      }

      this.transactionClient = await this.pool.connect();
      await this.transactionClient.query('BEGIN');
      this.emit('transaction:started');
    } catch (error) {
      logger.error('Error starting transaction:', error);
      throw new AppError('Error starting transaction', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Commit transaction
  public async commitTransaction(): Promise<void> {
    try {
      if (!this.transactionClient) {
        throw new AppError('No transaction in progress', HTTP_STATUS.CONFLICT);
      }

      await this.transactionClient.query('COMMIT');
      this.transactionClient.release();
      this.transactionClient = null;
      this.emit('transaction:committed');
    } catch (error) {
      logger.error('Error committing transaction:', error);
      throw new AppError('Error committing transaction', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Rollback transaction
  public async rollbackTransaction(): Promise<void> {
    try {
      if (!this.transactionClient) {
        throw new AppError('No transaction in progress', HTTP_STATUS.CONFLICT);
      }

      await this.transactionClient.query('ROLLBACK');
      this.transactionClient.release();
      this.transactionClient = null;
      this.emit('transaction:rolledback');
    } catch (error) {
      logger.error('Error rolling back transaction:', error);
      throw new AppError('Error rolling back transaction', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get cache key
  private getCacheKey(text: string, params?: any[]): string {
    return `query:${text}:${JSON.stringify(params || [])}`;
  }

  // Get pool stats
  public async getStats(): Promise<{
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  }> {
    try {
      return {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount
      };
    } catch (error) {
      logger.error('Error getting pool stats:', error);
      throw new AppError('Error getting pool stats', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Check connection
  public async checkConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      client.release();
      return true;
    } catch (error) {
      logger.error('Error checking connection:', error);
      return false;
    }
  }

  // Close pool
  public async close(): Promise<void> {
    try {
      if (this.transactionClient) {
        await this.rollbackTransaction();
      }
      await this.pool.end();
      this.emit('db:closed');
    } catch (error) {
      logger.error('Error closing pool:', error);
      throw new AppError('Error closing pool', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export const dbManager = DatabaseManager.getInstance();