import puppeteer from 'puppeteer';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { NotificationService } from './NotificationService';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';
import { Validator } from '../utils/validator';

interface Proxy {
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol?: 'http' | 'https' | 'socks4' | 'socks5';
}

interface ProxyStats {
  total: number;
  active: number;
  failed: number;
  success: number;
  successRate: number;
  lastRotation: Date;
}

export class ProxyService {
  private static instance: ProxyService;
  private cacheService: CacheService;
  private queueService: QueueService;
  private notificationService: NotificationService;
  private proxies: Proxy[] = [];
  private currentIndex: number = 0;
  private stats: ProxyStats = {
    total: 0,
    active: 0,
    failed: 0,
    success: 0,
    successRate: 0,
    lastRotation: new Date()
  };

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): ProxyService {
    if (!ProxyService.instance) {
      ProxyService.instance = new ProxyService();
    }
    return ProxyService.instance;
  }

  public async loadProxies(proxies: Proxy[]): Promise<void> {
    try {
      // Validate proxies
      for (const proxy of proxies) {
        Validator.validateProxy(proxy);
      }

      this.proxies = proxies;
      this.currentIndex = 0;
      this.stats = {
        total: proxies.length,
        active: proxies.length,
        failed: 0,
        success: 0,
        successRate: 0,
        lastRotation: new Date()
      };

      // Cache proxies
      await this.cacheService.set('proxy:list', proxies, TIME.DAY);
      await this.cacheService.set('proxy:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'success',
        message: `Loaded ${proxies.length} proxies`
      });
    } catch (error) {
      logger.error('Failed to load proxies:', error);
      throw error;
    }
  }

  public async getNextProxy(): Promise<Proxy | null> {
    try {
      if (this.proxies.length === 0) {
        return null;
      }

      const proxy = this.proxies[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
      this.stats.lastRotation = new Date();

      // Update cache
      await this.cacheService.set('proxy:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Rotated to proxy ${proxy.host}:${proxy.port}`
      });

      return proxy;
    } catch (error) {
      logger.error('Failed to get next proxy:', error);
      return null;
    }
  }

  public async applyProxy(page: puppeteer.Page, proxy: Proxy): Promise<void> {
    try {
      const proxyUrl = this.formatProxyUrl(proxy);
      await page.authenticate({
        username: proxy.username || '',
        password: proxy.password || ''
      });

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Applied proxy ${proxy.host}:${proxy.port}`
      });
    } catch (error) {
      logger.error('Failed to apply proxy:', error);
      throw error;
    }
  }

  public async testProxy(proxy: Proxy): Promise<boolean> {
    try {
      const browser = await puppeteer.launch({
        args: [`--proxy-server=${this.formatProxyUrl(proxy)}`]
      });

      const page = await browser.newPage();
      if (proxy.username && proxy.password) {
        await page.authenticate({
          username: proxy.username,
          password: proxy.password
        });
      }

      await page.goto('https://api.ipify.org?format=json', {
        timeout: TIME.SECOND * 10
      });

      const content = await page.content();
      const isValid = content.includes(proxy.host);

      await browser.close();

      // Update stats
      if (isValid) {
        this.stats.success++;
      } else {
        this.stats.failed++;
      }
      this.stats.successRate = (this.stats.success / (this.stats.success + this.stats.failed)) * 100;

      // Update cache
      await this.cacheService.set('proxy:stats', this.stats, TIME.DAY);

      return isValid;
    } catch (error) {
      logger.error('Failed to test proxy:', error);
      return false;
    }
  }

  public async getProxyStats(): Promise<ProxyStats> {
    try {
      // Try to get from cache first
      const cachedStats = await this.cacheService.get('proxy:stats');
      if (cachedStats) {
        return cachedStats;
      }

      return this.stats;
    } catch (error) {
      logger.error('Failed to get proxy stats:', error);
      throw error;
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      return this.proxies.length > 0;
    } catch (error) {
      logger.error('Failed to check proxy connection:', error);
      return false;
    }
  }

  private formatProxyUrl(proxy: Proxy): string {
    const protocol = proxy.protocol || 'http';
    return `${protocol}://${proxy.host}:${proxy.port}`;
  }

  public async removeProxy(proxy: Proxy): Promise<void> {
    try {
      this.proxies = this.proxies.filter(p =>
        p.host !== proxy.host || p.port !== proxy.port
      );

      // Update stats
      this.stats.total = this.proxies.length;
      this.stats.active = this.proxies.length;

      // Update cache
      await this.cacheService.set('proxy:list', this.proxies, TIME.DAY);
      await this.cacheService.set('proxy:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Removed proxy ${proxy.host}:${proxy.port}`
      });
    } catch (error) {
      logger.error('Failed to remove proxy:', error);
      throw error;
    }
  }

  public async clearProxies(): Promise<void> {
    try {
      this.proxies = [];
      this.currentIndex = 0;
      this.stats = {
        total: 0,
        active: 0,
        failed: 0,
        success: 0,
        successRate: 0,
        lastRotation: new Date()
      };

      // Clear cache
      await this.cacheService.del('proxy:list');
      await this.cacheService.del('proxy:stats');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Cleared all proxies'
      });
    } catch (error) {
      logger.error('Failed to clear proxies:', error);
      throw error;
    }
  }
}