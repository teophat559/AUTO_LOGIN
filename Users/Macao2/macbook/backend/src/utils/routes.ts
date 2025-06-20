import { Router, Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { configManager } from './config';
import { middlewareManager } from './middleware';
import { validationManager } from './validation';
import { security } from './security';
import { AutoLoginController } from '../controllers/AutoLoginController';
import { ChromeController } from '../controllers/ChromeController';
import { rateLimiter } from './rate-limiter';
import { validateRequest } from './validation';

export interface RouteOptions {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
  validation?: {
    body?: any;
    query?: any;
    params?: any;
  };
  auth?: boolean;
  roles?: string[];
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  timeout?: number;
  cache?: {
    enabled: boolean;
    ttl: number;
  };
  description?: string;
  tags?: string[];
  deprecated?: boolean;
}

export class RouteManager {
  private static instance: RouteManager;
  private eventEmitter: EventEmitter;
  private router: Router;
  private routes: Map<string, RouteOptions>;
  private prefix: string;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.router = Router();
    this.routes = new Map();
    this.prefix = '';
  }

  public static getInstance(): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager();
    }
    return RouteManager.instance;
  }

  public getRouter(): Router {
    return this.router;
  }

  public setPrefix(prefix: string): void {
    this.prefix = prefix;
  }

  public getPrefix(): string {
    return this.prefix;
  }

  public addRoute(options: RouteOptions): void {
    try {
      const routeKey = `${options.method.toUpperCase()}:${options.path}`;

      if (this.routes.has(routeKey)) {
        throw new AppError(
          HTTP_STATUS.CONFLICT,
          `Route ${routeKey} already exists`
        );
      }

      const routePath = this.prefix + options.path;
      const routeHandler = this.createRouteHandler(options);

      this.router[options.method](routePath, routeHandler);
      this.routes.set(routeKey, options);

      this.eventEmitter.emit('route:added', {
        path: routePath,
        method: options.method,
        options
      });

      logger.info(`Route added: ${routeKey}`);
    } catch (error) {
      logger.error('Error adding route:', error);
      throw error;
    }
  }

  public removeRoute(method: string, path: string): void {
    try {
      const routeKey = `${method.toUpperCase()}:${path}`;

      if (!this.routes.has(routeKey)) {
        throw new AppError(
          HTTP_STATUS.NOT_FOUND,
          `Route ${routeKey} not found`
        );
      }

      this.routes.delete(routeKey);
      this.eventEmitter.emit('route:removed', { method, path });

      logger.info(`Route removed: ${routeKey}`);
    } catch (error) {
      logger.error('Error removing route:', error);
      throw error;
    }
  }

  public getRoute(method: string, path: string): RouteOptions | undefined {
    const routeKey = `${method.toUpperCase()}:${path}`;
    return this.routes.get(routeKey);
  }

  public getRoutes(): Map<string, RouteOptions> {
    return this.routes;
  }

  public clearRoutes(): void {
    this.routes.clear();
    this.eventEmitter.emit('routes:cleared');
    logger.info('All routes cleared');
  }

  private createRouteHandler(options: RouteOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Apply middleware
        if (options.middleware) {
          for (const middleware of options.middleware) {
            await new Promise((resolve, reject) => {
              middleware(req, res, (err?: any) => {
                if (err) reject(err);
                else resolve(undefined);
              });
            });
          }
        }

        // Apply validation
        if (options.validation) {
          await validationManager.validateRequest(req, options.validation);
        }

        // Apply authentication
        if (options.auth) {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            throw new AppError(
              HTTP_STATUS.UNAUTHORIZED,
              'Authentication required'
            );
          }

          const decoded = await security.verifyToken(token);
          req.user = decoded;

          if (options.roles && !options.roles.includes(decoded.role)) {
            throw new AppError(
              HTTP_STATUS.FORBIDDEN,
              'Insufficient permissions'
            );
          }
        }

        // Apply rate limiting
        if (options.rateLimit) {
          await middlewareManager.rateLimit(req, options.rateLimit);
        }

        // Apply timeout
        if (options.timeout) {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new AppError(
                HTTP_STATUS.REQUEST_TIMEOUT,
                'Request timeout'
              ));
            }, options.timeout);
          });

          await Promise.race([
            options.handler(req, res, next),
            timeoutPromise
          ]);
        } else {
          await options.handler(req, res, next);
        }
      } catch (error) {
        next(error);
      }
    };
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }
}

export const routeManager = RouteManager.getInstance();

const router = Router();
const autoLoginController = AutoLoginController.getInstance();
const chromeController = ChromeController.getInstance();

// Auto Login Routes
router.post('/auto-login/start',
  rateLimiter('auto-login', 10, 60000), // 10 requests per minute
  validateRequest('startAutoLogin'),
  autoLoginController.startAutoLogin.bind(autoLoginController)
);

router.get('/auto-login/status/:sessionId',
  rateLimiter('status-check', 30, 60000), // 30 requests per minute
  autoLoginController.checkLoginStatus.bind(autoLoginController)
);

router.post('/auto-login/save',
  rateLimiter('save-result', 50, 60000), // 50 requests per minute
  validateRequest('saveLoginResult'),
  autoLoginController.saveLoginResult.bind(autoLoginController)
);

router.get('/auto-login/history',
  rateLimiter('get-history', 20, 60000), // 20 requests per minute
  autoLoginController.getLoginHistory.bind(autoLoginController)
);

router.get('/auto-login/statistics',
  rateLimiter('get-stats', 10, 60000), // 10 requests per minute
  autoLoginController.getStatistics.bind(autoLoginController)
);

router.post('/auto-login/stop/:sessionId',
  rateLimiter('stop-login', 5, 60000), // 5 requests per minute
  autoLoginController.stopAutoLogin.bind(autoLoginController)
);

router.delete('/auto-login/record/:id',
  rateLimiter('delete-record', 20, 60000), // 20 requests per minute
  autoLoginController.deleteLoginRecord.bind(autoLoginController)
);

router.delete('/auto-login/history',
  rateLimiter('clear-history', 2, 60000), // 2 requests per minute
  autoLoginController.clearHistory.bind(autoLoginController)
);

router.get('/auto-login/export',
  rateLimiter('export', 5, 60000), // 5 requests per minute
  autoLoginController.exportHistory.bind(autoLoginController)
);

// Chrome Management Routes
router.get('/chrome/profiles',
  rateLimiter('get-profiles', 10, 60000),
  chromeController.getChromeProfiles.bind(chromeController)
);

router.post('/chrome/launch',
  rateLimiter('launch-chrome', 5, 60000),
  validateRequest('launchChrome'),
  chromeController.launchChrome.bind(chromeController)
);

router.post('/chrome/close/:sessionId',
  rateLimiter('close-chrome', 10, 60000),
  chromeController.closeChrome.bind(chromeController)
);

// System Status Routes
router.get('/system/status',
  rateLimiter('system-status', 30, 60000), // 30 requests per minute
  (req, res) => {
    const autoLoginController = AutoLoginController.getInstance();
    const chromeController = ChromeController.getInstance();

    // Get system information
    const systemInfo = {
      chromeRunning: chromeController.isChromeRunning(),
      activeSessions: autoLoginController.getActiveSessionsCount(),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: process.cpuUsage(),
      diskUsage: 0, // TODO: Implement disk usage check
      uptime: process.uptime()
    };

    res.json(systemInfo);
  }
);

// Settings Routes
router.get('/settings',
  rateLimiter('get-settings', 10, 60000),
  (req, res) => {
    // TODO: Implement settings retrieval from database
    const defaultSettings = {
      defaultChromePath: '',
      defaultProxy: '',
      autoSolveCaptcha: true,
      waitForOtp: false,
      retryCount: 3,
      pollingInterval: 3000
    };

    res.json(defaultSettings);
  }
);

router.put('/settings',
  rateLimiter('update-settings', 5, 60000),
  validateRequest('updateSettings'),
  (req, res) => {
    // TODO: Implement settings update in database
    res.json({
      status: 'success',
      message: 'Settings updated successfully'
    });
  }
);

// Proxy Management Routes
router.get('/proxy/list',
  rateLimiter('get-proxies', 10, 60000),
  (req, res) => {
    // TODO: Implement proxy list retrieval
    const proxies = [
      '127.0.0.1:8080',
      '127.0.0.1:8081',
      '127.0.0.1:8082'
    ];

    res.json({ proxies });
  }
);

router.post('/proxy/test',
  rateLimiter('test-proxy', 5, 60000),
  validateRequest('testProxy'),
  (req, res) => {
    // TODO: Implement proxy testing
    res.json({
      status: 'success',
      message: 'Proxy test completed',
      working: true
    });
  }
);

// Health Check Route
router.get('/health',
  (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  }
);

export { router as apiRoutes };
