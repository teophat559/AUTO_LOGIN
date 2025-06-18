import { Page } from 'puppeteer';
import { TIME } from './constants';
import logger from './logger';

export class Helpers {
  public static async waitForSelector(
    page: Page,
    selector: string,
    timeout = TIME.SECOND * 5
  ): Promise<void> {
    try {
      await page.waitForSelector(selector, { timeout });
    } catch (error) {
      logger.error('Wait for selector error:', error);
      throw error;
    }
  }

  public static async waitForNavigation(
    page: Page,
    timeout = TIME.SECOND * 30
  ): Promise<void> {
    try {
      await page.waitForNavigation({ timeout });
    } catch (error) {
      logger.error('Wait for navigation error:', error);
      throw error;
    }
  }

  public static async getElementText(
    page: Page,
    selector: string
  ): Promise<string> {
    try {
      await this.waitForSelector(page, selector);
      return await page.$eval(selector, (el) => el.textContent || '');
    } catch (error) {
      logger.error('Get element text error:', error);
      throw error;
    }
  }

  public static async clickElement(
    page: Page,
    selector: string
  ): Promise<void> {
    try {
      await this.waitForSelector(page, selector);
      await page.click(selector);
    } catch (error) {
      logger.error('Click element error:', error);
      throw error;
    }
  }

  public static async typeText(
    page: Page,
    selector: string,
    text: string
  ): Promise<void> {
    try {
      await this.waitForSelector(page, selector);
      await page.type(selector, text);
    } catch (error) {
      logger.error('Type text error:', error);
      throw error;
    }
  }

  public static async getCookiesAsString(page: Page): Promise<string> {
    try {
      const cookies = await page.cookies();
      return JSON.stringify(cookies);
    } catch (error) {
      logger.error('Get cookies error:', error);
      throw error;
    }
  }

  public static async setCookiesFromString(
    page: Page,
    cookiesString: string
  ): Promise<void> {
    try {
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
    } catch (error) {
      logger.error('Set cookies error:', error);
      throw error;
    }
  }

  public static async clearCookies(page: Page): Promise<void> {
    try {
      await page.deleteCookie();
    } catch (error) {
      logger.error('Clear cookies error:', error);
      throw error;
    }
  }

  public static async getIP(page: Page): Promise<string> {
    try {
      await page.goto('https://api.ipify.org');
      return await page.$eval('body', (el) => el.textContent || '');
    } catch (error) {
      logger.error('Get IP error:', error);
      throw error;
    }
  }

  public static async takeScreenshot(
    page: Page,
    path: string
  ): Promise<void> {
    try {
      await page.screenshot({ path });
    } catch (error) {
      logger.error('Take screenshot error:', error);
      throw error;
    }
  }

  public static async waitForTimeout(
    timeout: number
  ): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  }

  public static generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public static formatDate(date: Date): string {
    return date.toISOString();
  }

  public static sanitizeString(str: string): string {
    return str
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  public static truncateString(str: string, length: number): string {
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length) + '...';
  }

  public static isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  public static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  public static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  public static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}