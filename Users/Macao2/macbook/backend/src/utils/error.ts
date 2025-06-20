import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { ERRORS, HTTP } from './constants';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Operational error
    logger.error('Operational error:', {
      error: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      status: err.status
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Programming error
  logger.error('Programming error:', {
    error: err.message,
    stack: err.stack
  });

  return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: ERRORS.INTERNAL_SERVER_ERROR
  });
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  logger.error('Not found:', {
    method: req.method,
    url: req.url
  });

  return res.status(HTTP.NOT_FOUND).json({
    status: 'fail',
    message: ERRORS.NOT_FOUND
  });
};

// Validation error handler
export const validationErrorHandler = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, HTTP.UNPROCESSABLE_ENTITY);
};

// Cast error handler
export const castErrorHandler = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Duplicate key error handler
export const duplicateKeyErrorHandler = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// JWT error handler
export const jwtErrorHandler = () => {
  return new AppError('Invalid token. Please log in again!', HTTP.UNAUTHORIZED);
};

// JWT expired error handler
export const jwtExpiredErrorHandler = () => {
  return new AppError('Your token has expired! Please log in again.', HTTP.UNAUTHORIZED);
};

// Rate limit error handler
export const rateLimitErrorHandler = () => {
  return new AppError('Too many requests from this IP, please try again in an hour!', HTTP.TOO_MANY_REQUESTS);
};

// Proxy error handler
export const proxyErrorHandler = (err: any) => {
  const message = `Proxy error: ${err.message}`;
  return new AppError(message, HTTP.BAD_GATEWAY);
};

// Chrome error handler
export const chromeErrorHandler = (err: any) => {
  const message = `Chrome error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// Captcha error handler
export const captchaErrorHandler = (err: any) => {
  const message = `Captcha error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Login error handler
export const loginErrorHandler = (err: any) => {
  const message = `Login error: ${err.message}`;
  return new AppError(message, HTTP.UNAUTHORIZED);
};

// Notification error handler
export const notificationErrorHandler = (err: any) => {
  const message = `Notification error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// Database error handler
export const databaseErrorHandler = (err: any) => {
  const message = `Database error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Redis error handler
export const redisErrorHandler = (err: any) => {
  const message = `Redis error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// WebSocket error handler
export const websocketErrorHandler = (err: any) => {
  const message = `WebSocket error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// Queue error handler
export const queueErrorHandler = (err: any) => {
  const message = `Queue error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// Cache error handler
export const cacheErrorHandler = (err: any) => {
  const message = `Cache error: ${err.message}`;
  return new AppError(message, HTTP.SERVICE_UNAVAILABLE);
};

// Security error handler
export const securityErrorHandler = (err: any) => {
  const message = `Security error: ${err.message}`;
  return new AppError(message, HTTP.FORBIDDEN);
};

// Validation error handler
export const validatorErrorHandler = (err: any) => {
  const message = `Validation error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Middleware error handler
export const middlewareErrorHandler = (err: any) => {
  const message = `Middleware error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Route error handler
export const routeErrorHandler = (err: any) => {
  const message = `Route error: ${err.message}`;
  return new AppError(message, HTTP.NOT_FOUND);
};

// Controller error handler
export const controllerErrorHandler = (err: any) => {
  const message = `Controller error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Service error handler
export const serviceErrorHandler = (err: any) => {
  const message = `Service error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Utility error handler
export const utilityErrorHandler = (err: any) => {
  const message = `Utility error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Type error handler
export const typeErrorHandler = (err: any) => {
  const message = `Type error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Reference error handler
export const referenceErrorHandler = (err: any) => {
  const message = `Reference error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Syntax error handler
export const syntaxErrorHandler = (err: any) => {
  const message = `Syntax error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Range error handler
export const rangeErrorHandler = (err: any) => {
  const message = `Range error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// URI error handler
export const uriErrorHandler = (err: any) => {
  const message = `URI error: ${err.message}`;
  return new AppError(message, HTTP.BAD_REQUEST);
};

// Eval error handler
export const evalErrorHandler = (err: any) => {
  const message = `Eval error: ${err.message}`;
  return new AppError(message, HTTP.INTERNAL_SERVER_ERROR);
};

// Error handler factory
export const createErrorHandler = (type: string) => {
  const handlers: { [key: string]: (err: any) => AppError } = {
    validation: validationErrorHandler,
    cast: castErrorHandler,
    duplicateKey: duplicateKeyErrorHandler,
    jwt: jwtErrorHandler,
    jwtExpired: jwtExpiredErrorHandler,
    rateLimit: rateLimitErrorHandler,
    proxy: proxyErrorHandler,
    chrome: chromeErrorHandler,
    captcha: captchaErrorHandler,
    login: loginErrorHandler,
    notification: notificationErrorHandler,
    database: databaseErrorHandler,
    redis: redisErrorHandler,
    websocket: websocketErrorHandler,
    queue: queueErrorHandler,
    cache: cacheErrorHandler,
    security: securityErrorHandler,
    validator: validatorErrorHandler,
    middleware: middlewareErrorHandler,
    route: routeErrorHandler,
    controller: controllerErrorHandler,
    service: serviceErrorHandler,
    utility: utilityErrorHandler,
    type: typeErrorHandler,
    reference: referenceErrorHandler,
    syntax: syntaxErrorHandler,
    range: rangeErrorHandler,
    uri: uriErrorHandler,
    eval: evalErrorHandler
  };

  return handlers[type] || errorHandler;
};

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private handlers: Map<string, (err: any) => AppError>;

  private constructor() {
    this.handlers = new Map();
    this.initializeHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private initializeHandlers() {
    this.handlers.set('validation', validationErrorHandler);
    this.handlers.set('cast', castErrorHandler);
    this.handlers.set('duplicateKey', duplicateKeyErrorHandler);
    this.handlers.set('jwt', jwtErrorHandler);
    this.handlers.set('jwtExpired', jwtExpiredErrorHandler);
    this.handlers.set('rateLimit', rateLimitErrorHandler);
    this.handlers.set('proxy', proxyErrorHandler);
    this.handlers.set('chrome', chromeErrorHandler);
    this.handlers.set('captcha', captchaErrorHandler);
    this.handlers.set('login', loginErrorHandler);
    this.handlers.set('notification', notificationErrorHandler);
    this.handlers.set('database', databaseErrorHandler);
    this.handlers.set('redis', redisErrorHandler);
    this.handlers.set('websocket', websocketErrorHandler);
    this.handlers.set('queue', queueErrorHandler);
    this.handlers.set('cache', cacheErrorHandler);
    this.handlers.set('security', securityErrorHandler);
    this.handlers.set('validator', validatorErrorHandler);
    this.handlers.set('middleware', middlewareErrorHandler);
    this.handlers.set('route', routeErrorHandler);
    this.handlers.set('controller', controllerErrorHandler);
    this.handlers.set('service', serviceErrorHandler);
    this.handlers.set('utility', utilityErrorHandler);
    this.handlers.set('type', typeErrorHandler);
    this.handlers.set('reference', referenceErrorHandler);
    this.handlers.set('syntax', syntaxErrorHandler);
    this.handlers.set('range', rangeErrorHandler);
    this.handlers.set('uri', uriErrorHandler);
    this.handlers.set('eval', evalErrorHandler);
  }

  public handleError(err: any, type: string = 'unknown'): AppError {
    const handler = this.handlers.get(type);
    if (handler) {
      return handler(err);
    }
    return errorHandler(err, null, null, null);
  }

  public addHandler(type: string, handler: (err: any) => AppError) {
    this.handlers.set(type, handler);
  }

  public removeHandler(type: string) {
    this.handlers.delete(type);
  }

  public getHandler(type: string) {
    return this.handlers.get(type);
  }

  public hasHandler(type: string) {
    return this.handlers.has(type);
  }

  public getHandlers() {
    return Array.from(this.handlers.entries());
  }

  public clearHandlers() {
    this.handlers.clear();
    this.initializeHandlers();
  }
}