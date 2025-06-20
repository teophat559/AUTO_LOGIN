import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { logger } from './logger';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, JWT, CORS, RATE_LIMIT } from './constants';
import { AppError } from './error';

// Security configuration
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '1d';
const REFRESH_TOKEN_EXPIRY = '7d';
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Encryption key and IV
const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'your-secret-key', 'salt', 32);
const ENCRYPTION_IV = crypto.randomBytes(16);

// Security class
class Security {
  private static instance: Security;

  private constructor() {}

  public static getInstance(): Security {
    if (!Security.instance) {
      Security.instance = new Security();
    }
    return Security.instance;
  }

  // Password hashing
  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      logger.error('Error hashing password:', error);
      throw new AppError('Error hashing password', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Password verification
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Error verifying password:', error);
      throw new AppError('Error verifying password', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Password validation
  public validatePassword(password: string): boolean {
    return PASSWORD_PATTERN.test(password) && password.length >= PASSWORD_MIN_LENGTH;
  }

  // JWT token generation
  public generateToken(payload: any): string {
    try {
      return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: TOKEN_EXPIRY,
        algorithm: JWT.ALGORITHM,
        issuer: JWT.ISSUER,
        audience: JWT.AUDIENCE,
        subject: JWT.SUBJECT
      });
    } catch (error) {
      logger.error('Error generating token:', error);
      throw new AppError('Error generating token', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // JWT token verification
  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      logger.error('Error verifying token:', error);
      throw new AppError('Invalid token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  // Refresh token generation
  public generateRefreshToken(payload: any): string {
    try {
      return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key', {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        algorithm: JWT.ALGORITHM,
        issuer: JWT.ISSUER,
        audience: JWT.AUDIENCE,
        subject: JWT.SUBJECT
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new AppError('Error generating refresh token', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Refresh token verification
  public verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key');
    } catch (error) {
      logger.error('Error verifying refresh token:', error);
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  // Data encryption
  public encrypt(data: string): string {
    try {
      const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      logger.error('Error encrypting data:', error);
      throw new AppError('Error encrypting data', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Data decryption
  public decrypt(encryptedData: string): string {
    try {
      const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      logger.error('Error decrypting data:', error);
      throw new AppError('Error decrypting data', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // CSRF token generation
  public generateCSRFToken(): string {
    try {
      return crypto.randomBytes(32).toString('hex');
    } catch (error) {
      logger.error('Error generating CSRF token:', error);
      throw new AppError('Error generating CSRF token', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // CSRF token verification
  public verifyCSRFToken(token: string, storedToken: string): boolean {
    try {
      return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
    } catch (error) {
      logger.error('Error verifying CSRF token:', error);
      throw new AppError('Error verifying CSRF token', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Rate limiting middleware
  public rateLimitMiddleware() {
    const requests = new Map<string, number[]>();

    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip;
      const now = Date.now();
      const windowMs = RATE_LIMIT.WINDOW;
      const maxRequests = RATE_LIMIT.MAX;

      if (!requests.has(ip)) {
        requests.set(ip, []);
      }

      const userRequests = requests.get(ip)!;
      const windowStart = now - windowMs;

      // Remove old requests
      while (userRequests.length && userRequests[0] < windowStart) {
        userRequests.shift();
      }

      // Check rate limit
      if (userRequests.length >= maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        throw new AppError(RATE_LIMIT.MESSAGE, HTTP_STATUS.TOO_MANY_REQUESTS);
      }

      // Add new request
      userRequests.push(now);
      next();
    };
  }

  // CORS middleware
  public corsMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', CORS.ORIGIN);
      res.header('Access-Control-Allow-Methods', CORS.METHODS.join(','));
      res.header('Access-Control-Allow-Headers', CORS.ALLOWED_HEADERS.join(','));
      res.header('Access-Control-Allow-Credentials', CORS.CREDENTIALS.toString());
      res.header('Access-Control-Max-Age', CORS.MAX_AGE.toString());

      if (req.method === 'OPTIONS') {
        return res.sendStatus(HTTP_STATUS.OK);
      }

      next();
    };
  }

  // XSS protection middleware
  public xssProtectionMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    };
  }

  // Content Security Policy middleware
  public cspMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
      );
      next();
    };
  }

  // Helmet middleware
  public helmetMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Download-Options', 'noopen');
      res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      next();
    };
  }

  // Input sanitization
  public sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove on* attributes
      .trim();
  }

  // SQL injection prevention
  public preventSQLInjection(input: string): string {
    return input
      .replace(/['";]/g, '') // Remove quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*.*?\*\//g, '') // Remove SQL block comments
      .trim();
  }

  // File upload validation
  public validateFileUpload(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
  }

  // Secure cookie options
  public getSecureCookieOptions(): any {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    };
  }
}

export const security = Security.getInstance();