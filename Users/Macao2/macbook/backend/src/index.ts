import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ChromeController } from './controllers/ChromeController';
import { AutoLoginController } from './controllers/AutoLoginController';
import { NotificationService } from './services/NotificationService';
import { ProxyService } from './services/ProxyService';
import { DatabaseService } from './services/DatabaseService';
import { CacheService } from './utils/cache';
import { QueueService } from './utils/queue';
import { SecurityService } from './utils/security';
import { ErrorHandler } from './utils/error';
import { logger } from './utils/logger';
import { rateLimiter } from './utils/rate-limiter';
import { setupWebSocket } from './utils/websocket';
import { setupDatabase } from './utils/database';
import { setupCache } from './utils/cache';
import { setupQueue } from './utils/queue';
import { setupSecurity } from './utils/security';
import { setupValidation } from './utils/validation';
import { setupMiddleware } from './utils/middleware';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';
import { HTTP_STATUS } from './utils/constants';
import { AppError } from './utils/error';
import { configManager } from './utils/config';
import { middlewareManager } from './utils/middleware';
import { routeManager } from './utils/routes';
import { serviceManager } from './utils/services';

// Load environment variables
dotenv.config();

// Application class
class Application extends EventEmitter {
  private static instance: Application;
  private app: express.Application;
  private server: http.Server;
  private port: number;
  private host: string;

  private constructor() {
    super();
    this.app = express();
    this.port = configManager.get('port') || 3000;
    this.host = configManager.get('host') || 'localhost';
    this.server = http.createServer(this.app);
  }

  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }
    return Application.instance;
  }

  // Initialize application
  public async initialize(): Promise<void> {
    try {
      // Initialize services
      await serviceManager.initializeServices();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handlers
      this.setupErrorHandlers();

      // Start server
      await this.startServer();

      logger.info('Application initialized');
      this.emit('app:initialized');
    } catch (error) {
      logger.error('Error initializing application:', error);
      throw error;
    }
  }

  // Setup middleware
  private setupMiddleware(): void {
    // Request logger
    this.app.use(middlewareManager.requestLogger);

    // CORS handler
    this.app.use(middlewareManager.corsHandler);

    // Security headers
    this.app.use(middlewareManager.securityHeaders);

    // Request sanitizer
    this.app.use(middlewareManager.requestSanitizer);

    // Response transformer
    this.app.use(middlewareManager.responseTransformer);

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  // Setup routes
  private setupRoutes(): void {
    // API routes
    this.app.use(routeManager.getPrefix(), routeManager.getRouter());

    // Not found handler
    this.app.use(middlewareManager.notFoundHandler);
  }

  // Setup error handlers
  private setupErrorHandlers(): void {
    // Error handler
    this.app.use(middlewareManager.errorHandler);

    // Uncaught exception handler
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught exception:', error);
      this.emit('app:error', error);
    });

    // Unhandled rejection handler
    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled rejection:', reason);
      this.emit('app:error', reason);
    });
  }

  // Start server
  private async startServer(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.server.listen(this.port, this.host, () => {
          logger.info(`Server running at http://${this.host}:${this.port}`);
          resolve();
        });

        this.server.on('error', (error: Error) => {
          logger.error('Server error:', error);
          reject(error);
        });
      });

      this.emit('server:started');
    } catch (error) {
      logger.error('Error starting server:', error);
      throw error;
    }
  }

  // Stop server
  public async stopServer(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.server.close((error?: Error) => {
          if (error) {
            logger.error('Error stopping server:', error);
            reject(error);
          } else {
            logger.info('Server stopped');
            resolve();
          }
        });
      });

      this.emit('server:stopped');
    } catch (error) {
      logger.error('Error stopping server:', error);
      throw error;
    }
  }

  // Close application
  public async close(): Promise<void> {
    try {
      // Stop server
      await this.stopServer();

      // Close services
      await serviceManager.closeServices();

      logger.info('Application closed');
      this.emit('app:closed');
    } catch (error) {
      logger.error('Error closing application:', error);
      throw error;
    }
  }

  // Get application
  public getApp(): express.Application {
    return this.app;
  }

  // Get server
  public getServer(): http.Server {
    return this.server;
  }

  // Get port
  public getPort(): number {
    return this.port;
  }

  // Get host
  public getHost(): string {
    return this.host;
  }
}

// Create and export application instance
export const app = Application.getInstance();

// Start application
if (require.main === module) {
  app.initialize().catch((error) => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}