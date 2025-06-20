import puppeteer from 'puppeteer';
import { CacheService } from '../utils/cache';
import { QueueService } from '../utils/queue';
import { NotificationService } from './NotificationService';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';
import { Validator } from '../utils/validator';

interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

interface FormField {
  selector: string;
  value: string;
  type: 'text' | 'password' | 'checkbox' | 'radio' | 'select';
}

interface FormResult {
  success: boolean;
  message?: string;
  data?: any;
}

export class FormFillerService {
  private static instance: FormFillerService;
  private cacheService: CacheService;
  private queueService: QueueService;
  private notificationService: NotificationService;

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.queueService = QueueService.getInstance();
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): FormFillerService {
    if (!FormFillerService.instance) {
      FormFillerService.instance = new FormFillerService();
    }
    return FormFillerService.instance;
  }

  public async fillLoginForm(
    page: puppeteer.Page,
    credentials: LoginCredentials
  ): Promise<FormResult> {
    try {
      // Validate credentials
      Validator.validateLoginCredentials(credentials);

      // Wait for email field
      await page.waitForSelector('input[type="email"]', {
        timeout: TIME.SECOND * 10
      });

      // Type email and password
      await page.type('input[type="email"]', credentials.email);
      await page.type('input[type="password"]', credentials.password);

      // Click login button
      await page.click('button[type="submit"]');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Filled login form for ${credentials.email}`
      });

      // Wait for navigation
      await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: TIME.SECOND * 30
      });

      // Check for 2FA
      if (await this.checkFor2FA(page)) {
        if (!credentials.otp) {
          throw new Error('2FA code required');
        }
        await this.handle2FA(page, credentials.otp);
      }

      // Check for checkpoint
      if (await this.checkForCheckpoint(page)) {
        await this.handleCheckpoint(page);
      }

      return {
        success: true,
        message: 'Login form filled successfully'
      };
    } catch (error) {
      logger.error('Failed to fill login form:', error);
      throw error;
    }
  }

  public async fillForm(
    page: puppeteer.Page,
    fields: FormField[]
  ): Promise<FormResult> {
    try {
      // Validate fields
      for (const field of fields) {
        Validator.validateFormField(field);
      }

      // Fill each field
      for (const field of fields) {
        await this.fillField(page, field);
      }

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Form filled successfully'
      });

      return {
        success: true,
        message: 'Form filled successfully'
      };
    } catch (error) {
      logger.error('Failed to fill form:', error);
      throw error;
    }
  }

  public async clickButton(
    page: puppeteer.Page,
    selector: string
  ): Promise<FormResult> {
    try {
      // Validate selector
      Validator.validateSelector(selector);

      // Wait for button
      await page.waitForSelector(selector, {
        timeout: TIME.SECOND * 10
      });

      // Click button
      await page.click(selector);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Clicked button ${selector}`
      });

      return {
        success: true,
        message: 'Button clicked successfully'
      };
    } catch (error) {
      logger.error('Failed to click button:', error);
      throw error;
    }
  }

  public async selectOption(
    page: puppeteer.Page,
    selector: string,
    value: string
  ): Promise<FormResult> {
    try {
      // Validate selector and value
      Validator.validateSelector(selector);
      Validator.validateValue(value);

      // Wait for select
      await page.waitForSelector(selector, {
        timeout: TIME.SECOND * 10
      });

      // Select option
      await page.select(selector, value);

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `Selected option ${value} in ${selector}`
      });

      return {
        success: true,
        message: 'Option selected successfully'
      };
    } catch (error) {
      logger.error('Failed to select option:', error);
      throw error;
    }
  }

  public async checkCheckbox(
    page: puppeteer.Page,
    selector: string,
    checked: boolean = true
  ): Promise<FormResult> {
    try {
      // Validate selector
      Validator.validateSelector(selector);

      // Wait for checkbox
      await page.waitForSelector(selector, {
        timeout: TIME.SECOND * 10
      });

      // Check/uncheck checkbox
      const isChecked = await page.$eval(
        selector,
        (el: HTMLInputElement) => el.checked
      );

      if (isChecked !== checked) {
        await page.click(selector);
      }

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: `${checked ? 'Checked' : 'Unchecked'} checkbox ${selector}`
      });

      return {
        success: true,
        message: 'Checkbox updated successfully'
      };
    } catch (error) {
      logger.error('Failed to check checkbox:', error);
      throw error;
    }
  }

  private async handle2FA(page: puppeteer.Page, code: string): Promise<void> {
    try {
      // Wait for 2FA input
      await page.waitForSelector('input[type="text"]', {
        timeout: TIME.SECOND * 10
      });

      // Type 2FA code
      await page.type('input[type="text"]', code);

      // Click submit button
      await page.click('button[type="submit"]');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: '2FA code submitted'
      });

      // Wait for navigation
      await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: TIME.SECOND * 30
      });
    } catch (error) {
      logger.error('Failed to handle 2FA:', error);
      throw error;
    }
  }

  private async handleCheckpoint(page: puppeteer.Page): Promise<void> {
    try {
      // Click continue button
      await page.click('button[type="submit"]');

      // Send notification
      await this.notificationService.sendNotification({
        type: 'info',
        message: 'Checkpoint handled'
      });

      // Wait for navigation
      await page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: TIME.SECOND * 30
      });
    } catch (error) {
      logger.error('Failed to handle checkpoint:', error);
      throw error;
    }
  }

  private async checkFor2FA(page: puppeteer.Page): Promise<boolean> {
    try {
      return await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        return inputs.length > 0;
      });
    } catch (error) {
      logger.error('Failed to check for 2FA:', error);
      return false;
    }
  }

  private async checkForCheckpoint(page: puppeteer.Page): Promise<boolean> {
    try {
      return await page.evaluate(() => {
        const buttons = document.querySelectorAll('button[type="submit"]');
        return buttons.length > 0;
      });
    } catch (error) {
      logger.error('Failed to check for checkpoint:', error);
      return false;
    }
  }

  private async fillField(page: puppeteer.Page, field: FormField): Promise<void> {
    try {
      // Wait for field
      await page.waitForSelector(field.selector, {
        timeout: TIME.SECOND * 10
      });

      // Fill field based on type
      switch (field.type) {
        case 'text':
        case 'password':
          await page.type(field.selector, field.value);
          break;
        case 'checkbox':
          await this.checkCheckbox(page, field.selector, field.value === 'true');
          break;
        case 'radio':
          await page.click(field.selector);
          break;
        case 'select':
          await page.select(field.selector, field.value);
          break;
        default:
          throw new Error(`Unsupported field type: ${field.type}`);
      }
    } catch (error) {
      logger.error('Failed to fill field:', error);
      throw error;
    }
  }
}