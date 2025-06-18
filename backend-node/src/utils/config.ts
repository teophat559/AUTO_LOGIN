import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { AppConfig } from './types';
import { TIME } from './constants';

dotenv.config();

// Config options
export interface ConfigOptions {
  env?: string;
  configDir?: string;
  configFile?: string;
  watch?: boolean;
  reloadOnChange?: boolean;
}

// Config class
class ConfigManager extends EventEmitter {
  private static instance: ConfigManager;
  private config: any;
  private options: ConfigOptions;
  private watcher: fs.FSWatcher | null;

  private constructor(options: ConfigOptions = {}) {
    super();
    this.options = {
      env: options.env || process.env.NODE_ENV || 'development',
      configDir: options.configDir || path.join(process.cwd(), 'config'),
      configFile: options.configFile || 'config.json',
      watch: options.watch || false,
      reloadOnChange: options.reloadOnChange || true
    };

    this.config = {};
    this.watcher = null;
    this.loadConfig();
  }

  public static getInstance(options?: ConfigOptions): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager(options);
    }
    return ConfigManager.instance;
  }

  // Load config
  private loadConfig(): void {
    try {
      // Load .env file
      dotenv.config();

      // Load config file
      const configPath = path.join(this.options.configDir!, this.options.configFile!);
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(configData);
      }

      // Load environment variables
      this.loadEnvVars();

      // Watch for changes
      if (this.options.watch) {
        this.watchConfig();
      }

      this.emit('config:loaded', this.config);
    } catch (error) {
      logger.error('Error loading config:', error);
      throw new AppError('Error loading config', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Load environment variables
  private loadEnvVars(): void {
    const envPrefix = 'APP_';
    for (const key in process.env) {
      if (key.startsWith(envPrefix)) {
        const configKey = key.slice(envPrefix.length).toLowerCase();
        this.set(configKey, process.env[key]);
      }
    }
  }

  // Watch config file
  private watchConfig(): void {
    try {
      const configPath = path.join(this.options.configDir!, this.options.configFile!);
      this.watcher = fs.watch(configPath, (eventType) => {
        if (eventType === 'change' && this.options.reloadOnChange) {
          this.loadConfig();
        }
      });
    } catch (error) {
      logger.error('Error watching config:', error);
      throw new AppError('Error watching config', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get config value
  public get<T = any>(key: string, defaultValue?: T): T {
    try {
      const keys = key.split('.');
      let value = this.config;

      for (const k of keys) {
        if (value === undefined || value === null) {
          return defaultValue as T;
        }
        value = value[k];
      }

      return value !== undefined ? value : defaultValue as T;
    } catch (error) {
      logger.error('Error getting config value:', error);
      return defaultValue as T;
    }
  }

  // Set config value
  public set(key: string, value: any): void {
    try {
      const keys = key.split('.');
      let current = this.config;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
          current[k] = {};
        }
        current = current[k];
      }

      current[keys[keys.length - 1]] = value;
      this.emit('config:changed', { key, value });
    } catch (error) {
      logger.error('Error setting config value:', error);
      throw new AppError('Error setting config value', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete config value
  public delete(key: string): void {
    try {
      const keys = key.split('.');
      let current = this.config;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
          return;
        }
        current = current[k];
      }

      delete current[keys[keys.length - 1]];
      this.emit('config:deleted', { key });
    } catch (error) {
      logger.error('Error deleting config value:', error);
      throw new AppError('Error deleting config value', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Check if config value exists
  public has(key: string): boolean {
    try {
      const keys = key.split('.');
      let current = this.config;

      for (const k of keys) {
        if (current === undefined || current === null) {
          return false;
        }
        current = current[k];
      }

      return current !== undefined;
    } catch (error) {
      logger.error('Error checking config value:', error);
      return false;
    }
  }

  // Get all config
  public getAll(): any {
    return { ...this.config };
  }

  // Save config
  public async save(): Promise<void> {
    try {
      const configPath = path.join(this.options.configDir!, this.options.configFile!);
      await fs.promises.writeFile(configPath, JSON.stringify(this.config, null, 2));
      this.emit('config:saved');
    } catch (error) {
      logger.error('Error saving config:', error);
      throw new AppError('Error saving config', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Reload config
  public reload(): void {
    this.loadConfig();
  }

  // Close watcher
  public close(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

export const configManager = ConfigManager.getInstance();

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'auto_login',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true'
  },

  chrome: {
    executablePath: process.env.CHROME_PATH || '',
    userDataDir: process.env.CHROME_USER_DATA_DIR || '',
    defaultViewport: {
      width: 1280,
      height: 800
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1280,800'
    ]
  },

  proxy: {
    rotationInterval: TIME.MINUTE * 5,
    maxFailures: 3,
    minSuccessRate: 0.8
  },

  captcha: {
    maxAttempts: 3,
    retryDelay: TIME.SECOND * 5,
    solveTimeout: TIME.MINUTE
  }
};

export default config;
