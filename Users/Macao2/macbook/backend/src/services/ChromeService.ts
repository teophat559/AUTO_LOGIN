import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { ProxyService } from './ProxyService';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { NotificationService } from './NotificationService';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';
import { Validator } from '../utils/validator';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

interface ChromeProfile {
  id: string;
  name: string;
  path: string;
  lastUsed?: Date;
}

interface ChromeStats {
  total: number;
  active: number;
  failed: number;
  success: number;
  successRate: number;
  lastLaunch: Date;
}

export class ChromeService {
  private static instance: ChromeService;
  private cacheService: CacheService;
  private queueService: QueueService;
  private notificationService: NotificationService;
  private proxyService: ProxyService;
  private profiles: ChromeProfile[] = [];
  private browsers: Map<string, puppeteer.Browser> = new Map();
  private stats: ChromeStats = {
    total: 0,
    active: 0,
    failed: 0,
    success: 0,
    successRate: 0,
    lastLaunch: new Date()
  };

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.proxyService = ProxyService.getInstance();
  }

  public static getInstance(): ChromeService {
    if (!ChromeService.instance) {
      ChromeService.instance = new ChromeService();
    }
    return ChromeService.instance;
  }

  public async loadProfiles(profiles: ChromeProfile[]): Promise<void> {
    try {
      // Validate profiles
      for (const profile of profiles) {
        Validator.validateChromeProfile(profile);
      }

      this.profiles = profiles;
      this.stats = {
        total: profiles.length,
        active: 0,
        failed: 0,
        success: 0,
        successRate: 0,
        lastLaunch: new Date()
      };

      // Cache profiles and stats
      await this.cacheService.set('chrome:profiles', profiles, TIME.DAY);
      await this.cacheService.set('chrome:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'success',
        message: `Loaded ${profiles.length} Chrome profiles`
      });
    } catch (error) {
      logger.error('Failed to load Chrome profiles:', error);
      throw error;
    }
  }

  public async getProfiles(): Promise<ChromeProfile[]> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('chrome:profiles');
      if (cached) {
        return cached;
      }

      return this.profiles;
    } catch (error) {
      logger.error('Failed to get Chrome profiles:', error);
      throw error;
    }
  }

  public async launchChrome(
    profileId: string,
    useProxy: boolean = false
  ): Promise<puppeteer.Browser> {
    try {
      // Validate profile
      const profile = this.profiles.find(p => p.id === profileId);
      if (!profile) {
        throw new Error(`Profile ${profileId} not found`);
      }

      // Check if browser is already running
      if (this.browsers.has(profileId)) {
        return this.browsers.get(profileId)!;
      }

      // Get proxy if needed
      let proxy: any = null;
      if (useProxy) {
        proxy = await this.proxyService.getNextProxy();
        if (!proxy) {
          throw new Error('No proxy available');
        }
      }

      // Launch browser
      const browser = await puppeteer.launch({
        headless: false,
        userDataDir: profile.path,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080'
        ],
        ...(proxy && {
          args: [`--proxy-server=${proxy.host}:${proxy.port}`]
        })
      });

      // Store browser instance
      this.browsers.set(profileId, browser);
      profile.lastUsed = new Date();

      // Update stats
      this.stats.active++;
      this.stats.success++;
      this.stats.successRate = (this.stats.success / (this.stats.success + this.stats.failed)) * 100;
      this.stats.lastLaunch = new Date();

      // Update cache
      await this.cacheService.set('chrome:profiles', this.profiles, TIME.DAY);
      await this.cacheService.set('chrome:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'success',
        message: `Launched Chrome for profile ${profile.name}`
      });

      return browser;
    } catch (error) {
      // Update stats
      this.stats.failed++;
      this.stats.successRate = (this.stats.success / (this.stats.success + this.stats.failed)) * 100;

      // Update cache
      await this.cacheService.set('chrome:stats', this.stats, TIME.DAY);

      logger.error('Failed to launch Chrome:', error);
      throw error;
    }
  }

  public async closeChrome(profileId: string): Promise<void> {
    try {
      const browser = this.browsers.get(profileId);
      if (!browser) {
        throw new Error(`Browser for profile ${profileId} not found`);
      }

      await browser.close();
      this.browsers.delete(profileId);

      // Update stats
      this.stats.active--;

      // Update cache
      await this.cacheService.set('chrome:stats', this.stats, TIME.DAY);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Closed Chrome for profile ${profileId}`
      });
    } catch (error) {
      logger.error('Failed to close Chrome:', error);
      throw error;
    }
  }

  public async navigateToUrl(
    profileId: string,
    url: string
  ): Promise<puppeteer.Page> {
    try {
      // Validate URL
      Validator.validateUrl(url);

      const browser = this.browsers.get(profileId);
      if (!browser) {
        throw new Error(`Browser for profile ${profileId} not found`);
      }

      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: TIME.SECOND * 30
      });

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Navigated to ${url} for profile ${profileId}`
      });

      return page;
    } catch (error) {
      logger.error('Failed to navigate to URL:', error);
      throw error;
    }
  }

  public async getBrowserStatus(profileId: string): Promise<{
    isRunning: boolean;
    lastUsed?: Date;
  }> {
    try {
      const browser = this.browsers.get(profileId);
      const profile = this.profiles.find(p => p.id === profileId);

      return {
        isRunning: !!browser,
        lastUsed: profile?.lastUsed
      };
    } catch (error) {
      logger.error('Failed to get browser status:', error);
      throw error;
    }
  }

  public async getStats(): Promise<ChromeStats> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('chrome:stats');
      if (cached) {
        return cached;
      }

      return this.stats;
    } catch (error) {
      logger.error('Failed to get Chrome stats:', error);
      throw error;
    }
  }

  public async clearProfiles(): Promise<void> {
    try {
      // Close all browsers
      for (const [profileId, browser] of this.browsers) {
        await browser.close();
      }
      this.browsers.clear();

      // Clear profiles
      this.profiles = [];
      this.stats = {
        total: 0,
        active: 0,
        failed: 0,
        success: 0,
        successRate: 0,
        lastLaunch: new Date()
      };

      // Clear cache
      await this.cacheService.del('chrome:profiles');
      await this.cacheService.del('chrome:stats');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Cleared all Chrome profiles'
      });
    } catch (error) {
      logger.error('Failed to clear Chrome profiles:', error);
      throw error;
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      return this.browsers.size > 0;
    } catch (error) {
      logger.error('Failed to check Chrome connection:', error);
      return false;
    }
  }

  async getCookies(browser: puppeteer.Browser): Promise<string> {
    try {
      const pages = await browser.pages();
      const cookies = await pages[0].cookies();
      return JSON.stringify(cookies);
    } catch (error) {
      console.error('Failed to get cookies:', error);
      throw error;
    }
  }

  async deleteChromeProfile(profileId: string): Promise<void> {
    try {
      const profilePath = path.join(this.chromeProfilesPath, 'User Data', profileId);
      await fs.promises.rm(profilePath, { recursive: true, force: true });
    } catch (error) {
      console.error('Failed to delete Chrome profile:', error);
      throw error;
    }
  }

  async checkLoginStatus(page: puppeteer.Page): Promise<{
    status: 'success' | 'pending' | 'failed';
    type?: '2fa' | 'checkpoint' | 'captcha';
    message?: string;
  }> {
    try {
      // Check for 2FA
      const twoFactorForm = await page.$('form[action*="checkpoint"]');
      if (twoFactorForm) {
        return {
          status: 'pending',
          type: '2fa',
          message: 'Two-factor authentication required'
        };
      }

      // Check for checkpoint
      const checkpointForm = await page.$('form[action*="checkpoint"]');
      if (checkpointForm) {
        return {
          status: 'pending',
          type: 'checkpoint',
          message: 'Checkpoint verification required'
        };
      }

      // Check for captcha
      const captchaForm = await page.$('form[action*="captcha"]');
      if (captchaForm) {
        return {
          status: 'pending',
          type: 'captcha',
          message: 'Captcha verification required'
        };
      }

      // Check for successful login
      const homeElement = await page.$('[data-pagelet="root"]');
      if (homeElement) {
        return {
          status: 'success',
          message: 'Successfully logged in'
        };
      }

      // Check for login error
      const errorElement = await page.$('[data-sigil="error-message"]');
      if (errorElement) {
        const errorText = await errorElement.evaluate(el => el.textContent);
        return {
          status: 'failed',
          message: errorText || 'Login failed'
        };
      }

      return {
        status: 'pending',
        message: 'Checking login status...'
      };
    } catch (error) {
      console.error('Failed to check login status:', error);
      return {
        status: 'failed',
        message: 'Error checking login status'
      };
    }
  }

  async markProxyResult(proxy: any, success: boolean): Promise<void> {
    if (success) {
      await this.proxyService.markProxySuccess(proxy);
    } else {
      await this.proxyService.markProxyFailure(proxy);
    }
  }
}