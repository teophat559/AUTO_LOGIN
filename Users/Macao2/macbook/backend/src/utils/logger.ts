import winston from 'winston';
import { format } from 'winston';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { TIME } from './constants';

// Create logs directory if not exists
const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir);
}

// Custom format for logs
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  defaultMeta: { service: 'backend-node' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// Add request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

// Add error logging middleware
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next(err);
};

// Add performance logging
export const performanceLogger = (label: string) => {
  const start = Date.now();
  return {
    end: () => {
      const duration = Date.now() - start;
      logger.debug(`Performance: ${label}`, {
        duration: `${duration}ms`
      });
    }
  };
};

// Add memory usage logging
export const memoryLogger = () => {
  const used = process.memoryUsage();
  logger.debug('Memory usage', {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(used.external / 1024 / 1024)}MB`
  });
};

// Add periodic logging
export const startPeriodicLogging = () => {
  // Log memory usage every hour
  setInterval(() => {
    memoryLogger();
  }, TIME.HOUR);

  // Log performance metrics every 5 minutes
  setInterval(() => {
    const metrics = process.metrics();
    logger.debug('Performance metrics', {
      cpu: metrics.cpu,
      memory: metrics.memory,
      eventLoop: metrics.eventLoop
    });
  }, TIME.MINUTE * 5);
};

// Add custom log levels
export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Add custom log colors
export const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Add custom log format
export const logFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Add custom log transport
export const customTransport = new winston.transports.File({
  filename: join(logsDir, 'custom.log'),
  format: format.combine(
    format.timestamp(),
    format.json()
  )
});

// Add custom log stream
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Add custom log function
export const customLog = (level: string, message: string, meta?: any) => {
  logger.log(level, message, meta);
};

// Add custom error log function
export const customErrorLog = (error: Error, meta?: any) => {
  logger.error(error.message, {
    stack: error.stack,
    ...meta
  });
};

// Add custom warn log function
export const customWarnLog = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

// Add custom info log function
export const customInfoLog = (message: string, meta?: any) => {
  logger.info(message, meta);
};

// Add custom debug log function
export const customDebugLog = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Add custom http log function
export const customHttpLog = (message: string, meta?: any) => {
  logger.http(message, meta);
};

// Add custom log level function
export const setLogLevel = (level: string) => {
  logger.level = level;
};

// Add custom log transport function
export const addLogTransport = (transport: winston.transport) => {
  logger.add(transport);
};

// Add custom log format function
export const setLogFormat = (format: winston.Logform.Format) => {
  logger.format = format;
};

// Add custom log color function
export const setLogColor = (level: string, color: string) => {
  logColors[level] = color;
};

// Add custom log level function
export const setLogLevels = (levels: any) => {
  logLevels = levels;
};

// Add custom log stream function
export const setLogStream = (stream: any) => {
  logStream = stream;
};

// Add custom log function
export const setCustomLog = (fn: any) => {
  customLog = fn;
};

// Add custom error log function
export const setCustomErrorLog = (fn: any) => {
  customErrorLog = fn;
};

// Add custom warn log function
export const setCustomWarnLog = (fn: any) => {
  customWarnLog = fn;
};

// Add custom info log function
export const setCustomInfoLog = (fn: any) => {
  customInfoLog = fn;
};

// Add custom debug log function
export const setCustomDebugLog = (fn: any) => {
  customDebugLog = fn;
};

// Add custom http log function
export const setCustomHttpLog = (fn: any) => {
  customHttpLog = fn;
};

// Add custom log level function
export const setCustomLogLevel = (fn: any) => {
  setLogLevel = fn;
};

// Add custom log transport function
export const setCustomLogTransport = (fn: any) => {
  addLogTransport = fn;
};

// Add custom log format function
export const setCustomLogFormat = (fn: any) => {
  setLogFormat = fn;
};

// Add custom log color function
export const setCustomLogColor = (fn: any) => {
  setLogColor = fn;
};

// Add custom log level function
export const setCustomLogLevels = (fn: any) => {
  setLogLevels = fn;
};

// Add custom log stream function
export const setCustomLogStream = (fn: any) => {
  setLogStream = fn;
};