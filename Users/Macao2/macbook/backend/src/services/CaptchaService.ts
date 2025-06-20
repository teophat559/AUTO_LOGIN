import puppeteer from 'puppeteer';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { NotificationService } from './NotificationService';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';
import { Validator } from '../utils/validator';

interface CaptchaSolution {
  id: string;
  image: string;
  solution: string;
  timestamp: Date;
  status: 'pending' | 'solved' | 'failed';
}

interface CaptchaStats {
  total: number;
  solved: number;
  failed: number;
  successRate: number;
  lastSolved: Date;
}

export class CaptchaService {
  private static instance: CaptchaService;
  private cacheService: CacheService;
  private queueService: QueueService;
  private notificationService: NotificationService;
  private solutions: Map<string, CaptchaSolution> = new Map();
  private stats: CaptchaStats = {
    total: 0,
    solved: 0,
    failed: 0,
    successRate: 0,
    lastSolved: new Date()
  };

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): CaptchaService {
    if (!CaptchaService.instance) {
      CaptchaService.instance = new CaptchaService();
    }
    return CaptchaService.instance;
  }

  public async solveCaptcha(page: puppeteer.Page): Promise<CaptchaSolution> {
    try {
      // Check for captcha
      const captchaImage = await this.getCaptchaImage(page);
      if (!captchaImage) {
        throw new Error('No captcha found');
      }

      // Generate unique ID
      const id = Math.random().toString(36).substring(7);

      // Create solution object
      const solution: CaptchaSolution = {
        id,
        image: captchaImage,
        solution: '',
        timestamp: new Date(),
        status: 'pending'
      };

      // Store solution
      this.solutions.set(id, solution);

      // Update stats
      this.stats.total++;
      this.stats.successRate = (this.stats.solved / this.stats.total) * 100;

      // Cache solution and stats
      await this.cacheService.set(`captcha:${id}`, solution, TIME.HOUR);
      await this.cacheService.set('captcha:stats', this.stats, TIME.HOUR);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Captcha detected, waiting for solution'
      });

      // Process solution in queue
      await this.queueService.add('captcha', async () => {
        try {
          // Wait for solution
          const solvedSolution = await this.waitForSolution(id);
          if (!solvedSolution) {
            throw new Error('Solution timeout');
          }

          // Fill solution
          await this.fillCaptchaSolution(page, solvedSolution.solution);

          // Update solution
          solvedSolution.status = 'solved';
          this.solutions.set(id, solvedSolution);

          // Update stats
          this.stats.solved++;
          this.stats.successRate = (this.stats.solved / this.stats.total) * 100;
          this.stats.lastSolved = new Date();

          // Update cache
          await this.cacheService.set(`captcha:${id}`, solvedSolution, TIME.HOUR);
          await this.cacheService.set('captcha:stats', this.stats, TIME.HOUR);

          // Send notification
          await this.notificationService.sendNotification({
            type: 'success',
            message: 'Captcha solved successfully'
          });
        } catch (error) {
          // Update solution
          const failedSolution = this.solutions.get(id);
          if (failedSolution) {
            failedSolution.status = 'failed';
            this.solutions.set(id, failedSolution);
          }

          // Update stats
          this.stats.failed++;
          this.stats.successRate = (this.stats.solved / this.stats.total) * 100;

          // Update cache
          await this.cacheService.set(`captcha:${id}`, failedSolution, TIME.HOUR);
          await this.cacheService.set('captcha:stats', this.stats, TIME.HOUR);

          // Send notification
          await this.notificationService.sendNotification({
            type: 'error',
            message: 'Failed to solve captcha'
          });

          throw error;
        }
      });

      return solution;
    } catch (error) {
      logger.error('Failed to solve captcha:', error);
      throw error;
    }
  }

  public async getCaptchaImage(page: puppeteer.Page): Promise<string | null> {
    try {
      // Find captcha image
      const image = await page.evaluate(() => {
        const img = document.querySelector('img[src*="captcha"]');
        return img ? img.getAttribute('src') : null;
      });

      if (!image) {
        return null;
      }

      // Get base64 image
      const base64 = await page.evaluate((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = src;
        });
      }, image);

      return base64 as string;
    } catch (error) {
      logger.error('Failed to get captcha image:', error);
      return null;
    }
  }

  public async fillCaptchaSolution(
    page: puppeteer.Page,
    solution: string
  ): Promise<void> {
    try {
      // Find captcha input
      const input = await page.$('input[name="captcha"]');
      if (!input) {
        throw new Error('Captcha input not found');
      }

      // Type solution
      await input.type(solution);

      // Click submit button
      await page.click('button[type="submit"]');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Captcha solution submitted'
      });

      // Wait for navigation
      await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: TIME.SECOND * 30
      });
    } catch (error) {
      logger.error('Failed to fill captcha solution:', error);
      throw error;
    }
  }

  public async waitForSolution(
    id: string,
    timeout: number = TIME.SECOND * 30
  ): Promise<CaptchaSolution | null> {
    try {
      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const solution = this.solutions.get(id);
        if (solution && solution.status !== 'pending') {
          return solution;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return null;
    } catch (error) {
      logger.error('Failed to wait for solution:', error);
      return null;
    }
  }

  public async submitSolution(
    id: string,
    solution: string
  ): Promise<CaptchaSolution> {
    try {
      // Validate solution
      Validator.validateCaptchaSolution(solution);

      // Get captcha
      const captcha = this.solutions.get(id);
      if (!captcha) {
        throw new Error(`Captcha ${id} not found`);
      }

      // Update solution
      captcha.solution = solution;
      captcha.status = 'solved';
      this.solutions.set(id, captcha);

      // Update stats
      this.stats.solved++;
      this.stats.successRate = (this.stats.solved / this.stats.total) * 100;
      this.stats.lastSolved = new Date();

      // Update cache
      await this.cacheService.set(`captcha:${id}`, captcha, TIME.HOUR);
      await this.cacheService.set('captcha:stats', this.stats, TIME.HOUR);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'success',
        message: 'Captcha solution submitted'
      });

      return captcha;
    } catch (error) {
      logger.error('Failed to submit solution:', error);
      throw error;
    }
  }

  public async getCaptchaStatus(id: string): Promise<CaptchaSolution | null> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get(`captcha:${id}`);
      if (cached) {
        return cached;
      }

      return this.solutions.get(id) || null;
    } catch (error) {
      logger.error('Failed to get captcha status:', error);
      throw error;
    }
  }

  public async getStats(): Promise<CaptchaStats> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('captcha:stats');
      if (cached) {
        return cached;
      }

      return this.stats;
    } catch (error) {
      logger.error('Failed to get captcha stats:', error);
      throw error;
    }
  }

  public async clearCaptcha(id: string): Promise<void> {
    try {
      // Remove solution
      this.solutions.delete(id);

      // Clear cache
      await this.cacheService.del(`captcha:${id}`);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Cleared captcha ${id}`
      });
    } catch (error) {
      logger.error('Failed to clear captcha:', error);
      throw error;
    }
  }

  public async clearAllCaptchas(): Promise<void> {
    try {
      // Clear solutions
      this.solutions.clear();
      this.stats = {
        total: 0,
        solved: 0,
        failed: 0,
        successRate: 0,
        lastSolved: new Date()
      };

      // Clear cache
      await this.cacheService.del('captcha:stats');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Cleared all captchas'
      });
    } catch (error) {
      logger.error('Failed to clear all captchas:', error);
      throw error;
    }
  }
}
