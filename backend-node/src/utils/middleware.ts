import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { configManager } from './config';
import { redisManager } from './redis';
import { security } from './security';
import { validation } from './validation';

// Middleware class
class MiddlewareManager extends EventEmitter {
  private static instance: MiddlewareManager;
  private eventEmitter: EventEmitter;
  private redis: Redis;

  private constructor() {
    super();
    this.eventEmitter = new EventEmitter();
    this.redis = new Redis({
      host: configManager.get('database.host'),
      port: configManager.get('database.port')
    });

    this.redis.on('error', (error) => {
      logger.error('Redis error:', error);
      this.eventEmitter.emit('redis:error', error);
    });
  }

  public static getInstance(): MiddlewareManager {
    if (!MiddlewareManager.instance) {
      MiddlewareManager.instance = new MiddlewareManager();
    }
    return MiddlewareManager.instance;
  }

  // Request logger
  public requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const requestId = security.generateToken();

    req.requestId = requestId;
    logger.info('Request started', {
      id: requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info('Request finished', {
        id: requestId,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration
      });
    });

    next();
  };

  // Error handler
  public errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error('Error occurred:', err);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.code || 'INTERNAL_ERROR',
          message: err.message,
          details: err.details
        }
      });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        }
      });
    }
  };

  // Not found handler
  public notFoundHandler = (req: Request, res: Response): void => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found'
      }
    });
  };

  // Rate limiter
  public rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = `ratelimit:${req.ip}`;
      const limit = configManager.get('rateLimit.max');
      const window = configManager.get('rateLimit.window');

      const count = await redisManager.incr(key);
      if (count === 1) {
        await redisManager.expire(key, window);
      }

      if (count > limit) {
        throw new AppError(
          configManager.get('rateLimit.message'),
          HTTP_STATUS.TOO_MANY_REQUESTS
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  // CORS handler
  public corsHandler = (req: Request, res: Response, next: NextFunction): void => {
    const cors = configManager.get('cors');
    res.header('Access-Control-Allow-Origin', cors.origin.join(','));
    res.header('Access-Control-Allow-Methods', cors.methods.join(','));
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', cors.credentials.toString());

    if (req.method === 'OPTIONS') {
      res.sendStatus(HTTP_STATUS.OK);
    } else {
      next();
    }
  };

  // Security headers
  public securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.header('Content-Security-Policy', "default-src 'self'");
    next();
  };

  // Request validator
  public requestValidator = (schema: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await validation.validate(req.body, schema);
        if (!result.isValid) {
          throw new AppError('Validation error', HTTP_STATUS.BAD_REQUEST, {
            details: result.errors
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  };

  // Authentication
  public authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
      }

      const decoded = await security.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

  // Authorization
  public authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
        }

        if (!roles.includes(req.user.role)) {
          throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  // Request sanitizer
  public requestSanitizer = (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (req.body) {
        req.body = security.sanitizeInput(req.body);
      }
      if (req.query) {
        req.query = security.sanitizeInput(req.query);
      }
      if (req.params) {
        req.params = security.sanitizeInput(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  // File upload validator
  public fileUploadValidator = (options: {
    maxSize?: number;
    allowedTypes?: string[];
  }) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.files) {
          return next();
        }

        const files = Array.isArray(req.files) ? req.files : [req.files];
        for (const file of files) {
          const result = security.validateFileUpload(file, options);
          if (!result.isValid) {
            throw new AppError(result.error, HTTP_STATUS.BAD_REQUEST);
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  // Request timeout
  public requestTimeout = (timeout: number) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      res.setTimeout(timeout, () => {
        next(new AppError('Request timeout', HTTP_STATUS.REQUEST_TIMEOUT));
      });
      next();
    };
  };

  // Response transformer
  public responseTransformer = (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json;
    res.json = function(data: any): Response {
      const transformed = {
        success: true,
        data,
        metadata: {
          timestamp: new Date(),
          requestId: req.requestId
        }
      };
      return originalJson.call(this, transformed);
    };
    next();
  };

  public async rateLimit(req: Request, options: {
    windowMs: number;
    max: number;
    message?: string;
    keyGenerator?: (req: Request) => string;
  }): Promise<void> {
    const limiter = rateLimit({
      store: new RedisStore({
        client: this.redis,
        prefix: 'rate-limit:'
      }),
      windowMs: options.windowMs,
      max: options.max,
      message: options.message || 'Too many requests, please try again later.',
      keyGenerator: options.keyGenerator || ((req) => req.ip),
      handler: (req, res) => {
        logger.warn('Rate limit exceeded:', {
          ip: req.ip,
          path: req.path
        });
        throw new AppError(
          HTTP_STATUS.TOO_MANY_REQUESTS,
          options.message || 'Too many requests, please try again later.'
        );
      }
    });

    await new Promise((resolve, reject) => {
      limiter(req, {} as Response, (err?: any) => {
        if (err) reject(err);
        else resolve(undefined);
      });
    });
  }

  public loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many login attempts, please try again later.'
  });

  public captchaLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per window
    message: 'Too many captcha requests, please try again later.'
  });

  public proxyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per window
    message: 'Too many proxy requests, please try again later.'
  });

  public apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per window
    message: 'Too many API requests, please try again later.'
  });

  public async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          'Authentication required'
        );
      }

      const decoded = await security.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }

  public async roles(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new AppError(
            HTTP_STATUS.UNAUTHORIZED,
            'Authentication required'
          );
        }

        if (!roles.includes(req.user.role)) {
          throw new AppError(
            HTTP_STATUS.FORBIDDEN,
            'Insufficient permissions'
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public async errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.error('Error:', error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: {
            message: error.message,
            code: error.code
          }
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: {
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  public async notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        `Route ${req.method} ${req.path} not found`
      );
    } catch (error) {
      next(error);
    }
  }

  public async cleanup(): Promise<void> {
    await this.redis.quit();
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }
}

export const middlewareManager = MiddlewareManager.getInstance();