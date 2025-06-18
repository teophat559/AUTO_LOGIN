import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { VALIDATION, HTTP_STATUS } from './constants';
import { AppError } from './error';
import { LoginCredentials, Proxy } from '../types';

// Validation schema interface
interface ValidationSchema {
  [key: string]: {
    type: string;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    format?: string;
    enum?: any[];
    custom?: (value: any) => boolean;
    message?: string;
  };
}

// Validation result interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationManager {
  private static instance: ValidationManager;
  private eventEmitter: EventEmitter;
  private schemas: Map<string, any>;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.schemas = new Map();
  }

  public static getInstance(): ValidationManager {
    if (!ValidationManager.instance) {
      ValidationManager.instance = new ValidationManager();
    }
    return ValidationManager.instance;
  }

  // Add validation schema
  public addSchema(name: string, schema: ValidationSchema) {
    this.schemas.set(name, schema);
  }

  // Remove validation schema
  public removeSchema(name: string) {
    this.schemas.delete(name);
  }

  // Get validation schema
  public getSchema(name: string) {
    return this.schemas.get(name);
  }

  // Check if schema exists
  public hasSchema(name: string) {
    return this.schemas.has(name);
  }

  // Get all schemas
  public getSchemas() {
    return Array.from(this.schemas.entries());
  }

  // Clear all schemas
  public clearSchemas() {
    this.schemas.clear();
  }

  // Validate data against schema
  public validate(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];

    for (const [key, rules] of Object.entries(schema)) {
      const value = data[key];

      // Check required
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(rules.message || VALIDATION.REQUIRED);
        continue;
      }

      // Skip validation if value is not required and not present
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }

      // Check type
      if (rules.type && typeof value !== rules.type) {
        errors.push(rules.message || `Invalid type for ${key}`);
        continue;
      }

      // Check min
      if (rules.min !== undefined && value < rules.min) {
        errors.push(rules.message || VALIDATION.INVALID_MIN);
        continue;
      }

      // Check max
      if (rules.max !== undefined && value > rules.max) {
        errors.push(rules.message || VALIDATION.INVALID_MAX);
        continue;
      }

      // Check minLength
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(rules.message || VALIDATION.INVALID_MIN_LENGTH);
        continue;
      }

      // Check maxLength
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(rules.message || VALIDATION.INVALID_MAX_LENGTH);
        continue;
      }

      // Check pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message || VALIDATION.INVALID_PATTERN);
        continue;
      }

      // Check format
      if (rules.format) {
        switch (rules.format) {
          case 'email':
            if (!this.isValidEmail(value)) {
              errors.push(rules.message || VALIDATION.INVALID_EMAIL);
            }
            break;
          case 'url':
            if (!this.isValidUrl(value)) {
              errors.push(rules.message || VALIDATION.INVALID_URL);
            }
            break;
          case 'date':
            if (!this.isValidDate(value)) {
              errors.push(rules.message || VALIDATION.INVALID_DATE);
            }
            break;
          case 'number':
            if (!this.isValidNumber(value)) {
              errors.push(rules.message || VALIDATION.INVALID_NUMBER);
            }
            break;
          case 'boolean':
            if (!this.isValidBoolean(value)) {
              errors.push(rules.message || VALIDATION.INVALID_BOOLEAN);
            }
            break;
          case 'array':
            if (!this.isValidArray(value)) {
              errors.push(rules.message || VALIDATION.INVALID_ARRAY);
            }
            break;
          case 'object':
            if (!this.isValidObject(value)) {
              errors.push(rules.message || VALIDATION.INVALID_OBJECT);
            }
            break;
          case 'string':
            if (!this.isValidString(value)) {
              errors.push(rules.message || VALIDATION.INVALID_STRING);
            }
            break;
        }
      }

      // Check enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(rules.message || VALIDATION.INVALID_ENUM);
        continue;
      }

      // Check custom
      if (rules.custom && !rules.custom(value)) {
        errors.push(rules.message || `Invalid value for ${key}`);
        continue;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate request
  public validateRequest(req: Request, schema: any): void {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          error.details[0].message
        );
      }
    } catch (error) {
      logger.error('Validation error:', error);
      throw error;
    }
  }

  // Validate query
  public validateQuery(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(req.query, schema);

      if (!result.isValid) {
        logger.error('Validation error:', {
          errors: result.errors
        });

        return next(new AppError(result.errors.join('. '), 400));
      }

      next();
    };
  }

  // Validate params
  public validateParams(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(req.params, schema);

      if (!result.isValid) {
        logger.error('Validation error:', {
          errors: result.errors
        });

        return next(new AppError(result.errors.join('. '), 400));
      }

      next();
    };
  }

  // Validate headers
  public validateHeaders(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(req.headers, schema);

      if (!result.isValid) {
        logger.error('Validation error:', {
          errors: result.errors
        });

        return next(new AppError(result.errors.join('. '), 400));
      }

      next();
    };
  }

  // Validate cookies
  public validateCookies(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(req.cookies, schema);

      if (!result.isValid) {
        logger.error('Validation error:', {
          errors: result.errors
        });

        return next(new AppError(result.errors.join('. '), 400));
      }

      next();
    };
  }

  // Validate files
  public validateFiles(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(req.files, schema);

      if (!result.isValid) {
        logger.error('Validation error:', {
          errors: result.errors
        });

        return next(new AppError(result.errors.join('. '), 400));
      }

      next();
    };
  }

  // Validate captcha solution
  public validateCaptchaSolution(solution: string): boolean {
    return this.isValidString(solution) && solution.length >= 4 && solution.length <= 8;
  }

  // Validate email
  private isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  // Validate URL
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate date
  private isValidDate(date: string): boolean {
    const timestamp = Date.parse(date);
    return !isNaN(timestamp);
  }

  // Validate number
  private isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  // Validate boolean
  private isValidBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  // Validate array
  private isValidArray(value: any): boolean {
    return Array.isArray(value);
  }

  // Validate object
  private isValidObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  // Validate string
  private isValidString(value: any): boolean {
    return typeof value === 'string';
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid email format'
      );
    }
    return true;
  }

  public validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
      );
    }
    return true;
  }

  public validateOTP(otp: string): boolean {
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'OTP must be 6 digits'
      );
    }
    return true;
  }

  public validateProxy(proxy: Proxy): boolean {
    const hostRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^(\d{1,3}\.){3}\d{1,3}$/;
    if (!hostRegex.test(proxy.host)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid proxy host'
      );
    }

    if (proxy.port < 1 || proxy.port > 65535) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid proxy port'
      );
    }

    if (proxy.protocol && !['http', 'https', 'socks4', 'socks5'].includes(proxy.protocol)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid proxy protocol'
      );
    }

    return true;
  }

  public validateLoginCredentials(credentials: LoginCredentials): boolean {
    this.validateEmail(credentials.email);
    this.validatePassword(credentials.password);
    if (credentials.otp) {
      this.validateOTP(credentials.otp);
    }
    return true;
  }

  public validateProxyList(proxies: Proxy[]): boolean {
    if (!Array.isArray(proxies)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Proxies must be an array'
      );
    }

    if (proxies.length === 0) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Proxies array cannot be empty'
      );
    }

    proxies.forEach((proxy) => this.validateProxy(proxy));
    return true;
  }

  public validateChromePath(path: string): boolean {
    if (!path) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Chrome path is required'
      );
    }
    return true;
  }

  public validateSessionId(sessionId: string): boolean {
    const sessionIdRegex = /^[a-zA-Z0-9-_]+$/;
    if (!sessionIdRegex.test(sessionId)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid session ID format'
      );
    }
    return true;
  }

  public validateIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Invalid IP address format'
      );
    }
    return true;
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }
}

export const validationManager = ValidationManager.getInstance();