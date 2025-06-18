import { Pool, PoolClient } from 'pg';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { NotificationService } from './NotificationService';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';
import { Validator } from '../utils/validator';

interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

interface LoginHistory {
  id: string;
  email: string;
  status: 'success' | 'failed';
  timestamp: Date;
  proxy?: string;
  error?: string;
}

interface LoginStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
  lastLogin: Date;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;
  private cacheService: CacheService;
  private queueService: QueueService;
  private notificationService: NotificationService;

  private constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'autologin',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: process.env.DB_SSL === 'true'
    });

    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.notificationService = NotificationService.getInstance();

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
      this.notificationService.sendNotification({
        type: 'error',
        message: 'Database connection error'
      });
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      logger.info('Connected to database');
      await this.notificationService.sendNotification({
        type: 'success',
        message: 'Connected to database'
      });
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Disconnected from database');
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Disconnected from database'
      });
    } catch (error) {
      logger.error('Failed to disconnect from database:', error);
      throw error;
    }
  }

  public async saveLoginCredentials(credentials: LoginCredentials): Promise<void> {
    try {
      // Validate credentials
      Validator.validateLoginCredentials(credentials);

      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        const query = `
          INSERT INTO login_credentials (email, password, otp)
          VALUES ($1, $2, $3)
          ON CONFLICT (email) DO UPDATE
          SET password = $2, otp = $3
        `;

        await client.query(query, [
          credentials.email,
          credentials.password,
          credentials.otp
        ]);

        await client.query('COMMIT');

        // Clear cache
        await this.cacheService.del(`credentials:${credentials.email}`);

        // Send notification
        await this.notificationService.sendNotification({
          type: 'success',
          message: `Saved login credentials for ${credentials.email}`
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Failed to save login credentials:', error);
      throw error;
    }
  }

  public async getLoginCredentials(email: string): Promise<LoginCredentials | null> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get(`credentials:${email}`);
      if (cached) {
        return cached;
      }

      const query = `
        SELECT email, password, otp
        FROM login_credentials
        WHERE email = $1
      `;

      const result = await this.pool.query(query, [email]);
      const credentials = result.rows[0] || null;

      if (credentials) {
        // Cache credentials
        await this.cacheService.set(
          `credentials:${email}`,
          credentials,
          TIME.HOUR
        );
      }

      return credentials;
    } catch (error) {
      logger.error('Failed to get login credentials:', error);
      throw error;
    }
  }

  public async saveLoginHistory(history: LoginHistory): Promise<void> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        const query = `
          INSERT INTO login_history (id, email, status, timestamp, proxy, error)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await client.query(query, [
          history.id,
          history.email,
          history.status,
          history.timestamp,
          history.proxy,
          history.error
        ]);

        await client.query('COMMIT');

        // Clear cache
        await this.cacheService.del('login:history');
        await this.cacheService.del('login:stats');

        // Send notification
        await this.notificationService.sendNotification({
          type: 'info',
          message: `Saved login history for ${history.email}`
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Failed to save login history:', error);
      throw error;
    }
  }

  public async getLoginHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{ history: LoginHistory[]; total: number }> {
    try {
      // Try to get from cache first
      const cacheKey = `login:history:${page}:${limit}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      const offset = (page - 1) * limit;

      const query = `
        SELECT id, email, status, timestamp, proxy, error
        FROM login_history
        ORDER BY timestamp DESC
        LIMIT $1 OFFSET $2
      `;

      const countQuery = `
        SELECT COUNT(*)
        FROM login_history
      `;

      const [result, countResult] = await Promise.all([
        this.pool.query(query, [limit, offset]),
        this.pool.query(countQuery)
      ]);

      const response = {
        history: result.rows,
        total: parseInt(countResult.rows[0].count)
      };

      // Cache response
      await this.cacheService.set(cacheKey, response, TIME.MINUTE * 5);

      return response;
    } catch (error) {
      logger.error('Failed to get login history:', error);
      throw error;
    }
  }

  public async getLoginStats(): Promise<LoginStats> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('login:stats');
      if (cached) {
        return cached;
      }

      const query = `
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as success,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
          MAX(timestamp) as last_login
        FROM login_history
      `;

      const result = await this.pool.query(query);
      const stats = {
        total: parseInt(result.rows[0].total),
        success: parseInt(result.rows[0].success),
        failed: parseInt(result.rows[0].failed),
        successRate: result.rows[0].total > 0
          ? (parseInt(result.rows[0].success) / parseInt(result.rows[0].total)) * 100
          : 0,
        lastLogin: result.rows[0].last_login
      };

      // Cache stats
      await this.cacheService.set('login:stats', stats, TIME.MINUTE * 5);

      return stats;
    } catch (error) {
      logger.error('Failed to get login stats:', error);
      throw error;
    }
  }

  public async clearLoginHistory(): Promise<void> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        await client.query('TRUNCATE login_history');

        await client.query('COMMIT');

        // Clear cache
        await this.cacheService.del('login:history');
        await this.cacheService.del('login:stats');

        // Send notification
        await this.notificationService.sendNotification({
          type: 'info',
          message: 'Cleared login history'
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Failed to clear login history:', error);
      throw error;
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      client.release();
      return true;
    } catch (error) {
      logger.error('Failed to check database connection:', error);
      return false;
    }
  }
}