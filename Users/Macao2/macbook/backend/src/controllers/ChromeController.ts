import { Router } from 'express';
import { Server } from 'socket.io';
import puppeteer from 'puppeteer';
import { ChromeService } from '../services/ChromeService';
import { DatabaseService } from '../services/DatabaseService';
import { NotificationService } from '../services/NotificationService';
import { ProxyService } from '../services/ProxyService';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { SecurityService } from '../utils/security';
import { Validator } from '../utils/validator';
import { ErrorHandler } from '../utils/error';
import { rateLimiter } from '../utils/rate-limiter';

export class ChromeController {
  public router: Router;
  private chromeService: ChromeService;
  private dbService: DatabaseService;
  private notificationService: NotificationService;
  private proxyService: ProxyService;
  private cacheService: CacheService;
  private queueService: QueueService;
  private securityService: SecurityService;
  private io: Server;
  private activeBrowsers: Map<string, puppeteer.Browser>;

  constructor(io: Server) {
    this.router = Router();
    this.chromeService = ChromeService.getInstance();
    this.dbService = DatabaseService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.proxyService = ProxyService.getInstance();
    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.securityService = SecurityService.getInstance();
    this.io = io;
    this.activeBrowsers = new Map();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Get Chrome profiles with cache
    this.router.get('/profiles', async (req, res) => {
      try {
        // Try to get from cache first
        const cachedProfiles = await this.cacheService.get('chrome:profiles');
        if (cachedProfiles) {
          return res.json(cachedProfiles);
        }

        const profiles = await this.chromeService.getChromeProfiles();

        // Cache profiles for 5 minutes
        await this.cacheService.set('chrome:profiles', profiles, 300);

        res.json(profiles);
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    // Launch Chrome with rate limiting and queue
    this.router.post('/launch', rateLimiter, async (req, res) => {
      try {
        const { profileId } = req.body;

        // Validate profile ID
        if (profileId) {
          Validator.validateChromePath(profileId);
        }

        // Add to queue
        await this.queueService.add('chrome:launch', async () => {
          const browser = await this.chromeService.launchChrome(profileId, true);
          this.activeBrowsers.set(profileId || 'default', browser);

          // Send notification
          await this.notificationService.sendNotification({
            type: 'success',
            message: `Chrome launched successfully for profile ${profileId || 'default'}`
          });

          // Cache browser status
          await this.cacheService.set(`browser:${profileId || 'default'}`, {
            isRunning: true,
            profileId: profileId || 'default',
            startTime: new Date()
          });
        });

        res.json({ success: true });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    // Navigate to URL with rate limiting
    this.router.post('/navigate', rateLimiter, async (req, res) => {
      try {
        const { url, profileId } = req.body;

        // Validate URL
        Validator.validateURL(url);

        const browser = this.activeBrowsers.get(profileId || 'default');
        if (!browser) {
          throw new Error('Browser not found');
        }

        // Add to queue
        await this.queueService.add('chrome:navigate', async () => {
          await this.chromeService.navigateToUrl(browser, url);

          // Send notification
          await this.notificationService.sendNotification({
            type: 'info',
            message: `Navigated to ${url}`
          });

          // Update cache
          await this.cacheService.set(`browser:${profileId || 'default'}`, {
            ...await this.cacheService.get(`browser:${profileId || 'default'}`),
            currentUrl: url,
            lastNavigation: new Date()
          });
        });

        res.json({ success: true });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    // Get Chrome status with cache
    this.router.get('/status', async (req, res) => {
      try {
        const { profileId } = req.query;
        const browser = this.activeBrowsers.get(profileId as string || 'default');

        // Try to get from cache first
        const cachedStatus = await this.cacheService.get(`browser:${profileId || 'default'}`);
        if (cachedStatus) {
          return res.json({
            ...cachedStatus,
            isRunning: !!browser
          });
        }

        const status = {
          isRunning: !!browser,
          currentProfile: profileId,
          startTime: browser ? new Date() : null
        };

        // Cache status
        await this.cacheService.set(`browser:${profileId || 'default'}`, status, 300);

        res.json(status);
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    // Get cookies with encryption
    this.router.get('/cookies', async (req, res) => {
      try {
        const { profileId } = req.query;
        const browser = this.activeBrowsers.get(profileId as string || 'default');

        if (!browser) {
          throw new Error('Browser not found');
        }

        const cookies = await this.chromeService.getCookies(browser);

        // Encrypt cookies
        const encryptedCookies = await this.securityService.encrypt(cookies);

        res.json({ cookies: encryptedCookies });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });

    // Delete Chrome profile with rate limiting
    this.router.delete('/profiles/:profileId', rateLimiter, async (req, res) => {
      try {
        const { profileId } = req.params;

        // Validate profile ID
        Validator.validateChromePath(profileId);

        await this.chromeService.deleteChromeProfile(profileId);
        this.activeBrowsers.delete(profileId);

        // Clear cache
        await this.cacheService.del(`browser:${profileId}`);
        await this.cacheService.del('chrome:profiles');

        // Send notification
        await this.notificationService.sendNotification({
          type: 'success',
          message: `Chrome profile ${profileId} deleted successfully`
        });

        res.json({ success: true });
      } catch (error) {
        ErrorHandler.handleError(error, res);
      }
    });
  }

  public async closeAllBrowsers() {
    for (const [profileId, browser] of this.activeBrowsers) {
      try {
        await browser.close();
        this.activeBrowsers.delete(profileId);

        // Clear cache
        await this.cacheService.del(`browser:${profileId}`);

        // Send notification
        await this.notificationService.sendNotification({
          type: 'info',
          message: `Browser closed for profile ${profileId}`
        });
      } catch (error) {
        console.error(`Failed to close browser for profile ${profileId}:`, error);

        // Send error notification
        await this.notificationService.sendNotification({
          type: 'error',
          message: `Failed to close browser for profile ${profileId}`
        });
      }
    }
  }
}