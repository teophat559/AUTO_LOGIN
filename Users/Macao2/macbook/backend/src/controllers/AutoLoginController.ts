import { Request, Response } from 'express';
import puppeteer, { Browser, Page } from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { DatabaseService } from '../services/DatabaseService';
import { NotificationService } from '../services/NotificationService';
import { ProxyService } from '../services/ProxyService';
import { CaptchaService } from '../services/CaptchaService';
import { AppError } from '../utils/error';
import { HTTP_STATUS } from '../utils/constants';

interface LoginFormData {
  email: string;
  password: string;
  otp?: string;
  chromePath?: string;
  proxy?: string;
  linkName?: string;
  useProxy: boolean;
  autoSolveCaptcha: boolean;
  waitForOtp: boolean;
  retryCount: number;
}

interface LoginSession {
  id: string;
  formData: LoginFormData;
  browser?: Browser;
  page?: Page;
  status: 'pending' | 'success' | 'error';
  message: string;
  startTime: Date;
  endTime?: Date;
  cookies?: string;
  ip?: string;
  errorType?: string;
}

class AutoLoginController {
  private static instance: AutoLoginController;
  private activeSessions: Map<string, LoginSession> = new Map();
  private databaseService: DatabaseService;
  private notificationService: NotificationService;
  private proxyService: ProxyService;
  private captchaService: CaptchaService;

  private constructor() {
    this.databaseService = DatabaseService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.proxyService = ProxyService.getInstance();
    this.captchaService = CaptchaService.getInstance();
  }

  public static getInstance(): AutoLoginController {
    if (!AutoLoginController.instance) {
      AutoLoginController.instance = new AutoLoginController();
    }
    return AutoLoginController.instance;
  }

  // Start auto login process
  public async startAutoLogin(req: Request, res: Response): Promise<void> {
    try {
      const formData: LoginFormData = req.body;

      // Validate input
      if (!formData.email || !formData.password) {
        throw new AppError('Email and password are required', HTTP_STATUS.BAD_REQUEST);
      }

      const sessionId = uuidv4();
      const session: LoginSession = {
        id: sessionId,
        formData,
        status: 'pending',
        message: 'Initializing auto login process...',
        startTime: new Date()
      };

      this.activeSessions.set(sessionId, session);

      // Start the login process in background
      this.processLogin(sessionId).catch(error => {
        logger.error('Login process error:', error);
        this.updateSession(sessionId, {
          status: 'error',
          message: error.message,
          endTime: new Date()
        });
      });

      // Send immediate response
      res.status(HTTP_STATUS.OK).json({
        status: 'pending',
        message: 'Auto login process started',
        sessionId,
        timestamp: new Date().toISOString()
      });

      // Send notification
      this.notificationService.sendNotification({
        type: 'info',
        title: 'Auto Login Started',
        message: `Starting auto login for ${formData.email}`,
        sessionId
      });

    } catch (error) {
      logger.error('Start auto login error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error instanceof AppError ? error.message : 'Internal server error'
      });
    }
  }

  // Check login status
  public async checkLoginStatus(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const session = this.activeSessions.get(sessionId);

      if (!session) {
        throw new AppError('Session not found', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json({
        status: session.status,
        message: session.message,
        sessionId,
        cookies: session.cookies,
        ip: session.ip,
        errorType: session.errorType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Check status error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error instanceof AppError ? error.message : 'Internal server error'
      });
    }
  }

  // Save login result
  public async saveLoginResult(req: Request, res: Response): Promise<void> {
    try {
      const resultData = req.body;

      // Validate required fields
      if (!resultData.email || !resultData.status) {
        throw new AppError('Email and status are required', HTTP_STATUS.BAD_REQUEST);
      }

      const query = `
        INSERT INTO login_history (
          email, password, otp, status, cookies, ip, chrome_path,
          link_name, result_message, error_type, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `;

      const values = [
        resultData.email,
        resultData.password,
        resultData.otp || null,
        resultData.status,
        resultData.cookies || null,
        resultData.ip || 'Unknown',
        resultData.chromePath || null,
        resultData.linkName || null,
        resultData.resultMessage || null,
        resultData.errorType || null,
        new Date()
      ];

      const result = await this.databaseService.query(query, values);

      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Login result saved successfully',
        id: result.rows[0].id
      });

    } catch (error) {
      logger.error('Save result error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error instanceof AppError ? error.message : 'Internal server error'
      });
    }
  }

  // Get login history
  public async getLoginHistory(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = (page - 1) * limit;

      const query = `
        SELECT
          id, email, otp, status, cookies, ip, chrome_path,
          link_name, result_message, error_type, created_at
        FROM login_history
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const countQuery = 'SELECT COUNT(*) FROM login_history';

      const [historyResult, countResult] = await Promise.all([
        this.databaseService.query(query, [limit, offset]),
        this.databaseService.query(countQuery)
      ]);

      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      res.status(HTTP_STATUS.OK).json({
        history: historyResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });

    } catch (error) {
      logger.error('Get history error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to fetch login history'
      });
    }
  }

  // Get statistics
  public async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const query = `
        SELECT
          status,
          COUNT(*) as count
        FROM login_history
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY status
      `;

      const result = await this.databaseService.query(query);

      const stats: any = {
        total: 0,
        success: 0,
        pending: 0,
        error: 0,
        checkpoint: 0,
        '2fa': 0,
        captcha: 0,
        wrong_password: 0,
        wrong_account: 0,
        wrong_phone: 0
      };

      result.rows.forEach(row => {
        stats[row.status] = parseInt(row.count);
        stats.total += parseInt(row.count);
      });

      res.status(HTTP_STATUS.OK).json(stats);

    } catch (error) {
      logger.error('Get statistics error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Stop auto login
  public async stopAutoLogin(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const session = this.activeSessions.get(sessionId);

      if (!session) {
        throw new AppError('Session not found', HTTP_STATUS.NOT_FOUND);
      }

      // Close browser if open
      if (session.browser) {
        await session.browser.close();
      }

      // Update session
      this.updateSession(sessionId, {
        status: 'error',
        message: 'Auto login stopped by user',
        endTime: new Date()
      });

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Auto login stopped successfully'
      });

    } catch (error) {
      logger.error('Stop auto login error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error instanceof AppError ? error.message : 'Internal server error'
      });
    }
  }

  // Delete login record
  public async deleteLoginRecord(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const query = 'DELETE FROM login_history WHERE id = $1';
      const result = await this.databaseService.query(query, [id]);

      if (result.rowCount === 0) {
        throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND);
      }

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Record deleted successfully'
      });

    } catch (error) {
      logger.error('Delete record error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error instanceof AppError ? error.message : 'Internal server error'
      });
    }
  }

  // Clear history
  public async clearHistory(req: Request, res: Response): Promise<void> {
    try {
      const query = 'DELETE FROM login_history';
      await this.databaseService.query(query);

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'History cleared successfully'
      });

    } catch (error) {
      logger.error('Clear history error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to clear history'
      });
    }
  }

  // Export history
  public async exportHistory(req: Request, res: Response): Promise<void> {
    try {
      const format = req.query.format as string || 'csv';

      const query = `
        SELECT
          email, otp, status, ip, chrome_path, link_name,
          result_message, error_type, created_at
        FROM login_history
        ORDER BY created_at DESC
      `;

      const result = await this.databaseService.query(query);

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=login-history.json');
        res.json(result.rows);
      } else {
        // CSV format
        const csvHeader = 'Email,OTP,Status,IP,Chrome Path,Link Name,Result Message,Error Type,Created At\n';
        const csvData = result.rows.map(row =>
          `"${row.email}","${row.otp || ''}","${row.status}","${row.ip || ''}","${row.chrome_path || ''}","${row.link_name || ''}","${row.result_message || ''}","${row.error_type || ''}","${row.created_at}"`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=login-history.csv');
        res.send(csvHeader + csvData);
      }

    } catch (error) {
      logger.error('Export history error:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to export history'
      });
    }
  }

  // Private methods
  private async processLogin(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    let browser: Browser | undefined;
    let page: Page | undefined;

    try {
      // Update status
      this.updateSession(sessionId, {
        message: 'Launching Chrome browser...'
      });

      // Launch browser
      const launchOptions: any = {
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      };

      // Add proxy if specified
      if (session.formData.useProxy && session.formData.proxy) {
        launchOptions.args.push(`--proxy-server=${session.formData.proxy}`);
      }

      browser = await puppeteer.launch(launchOptions);
      page = await browser.newPage();

      // Update session with browser and page
      this.activeSessions.set(sessionId, {
        ...session,
        browser,
        page
      });

      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Navigate to Facebook
      this.updateSession(sessionId, {
        message: 'Navigating to Facebook...'
      });

      await page.goto('https://www.facebook.com', { waitUntil: 'networkidle2' });

      // Fill login form
      this.updateSession(sessionId, {
        message: 'Filling login form...'
      });

      await page.type('#email', session.formData.email);
      await page.type('#pass', session.formData.password);
      await page.click('[type="submit"]');

      // Wait for navigation
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      // Check for various scenarios
      const currentUrl = page.url();

      if (currentUrl.includes('checkpoint')) {
        this.updateSession(sessionId, {
          status: 'error',
          message: 'Account checkpoint detected',
          errorType: 'checkpoint',
          endTime: new Date()
        });
        return;
      }

      if (currentUrl.includes('login/device-based/2fa')) {
        if (session.formData.otp) {
          await page.type('#approvals_code', session.formData.otp);
          await page.click('#checkpointSubmitButton');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } else {
          this.updateSession(sessionId, {
            status: 'error',
            message: '2FA code required',
            errorType: '2fa',
            endTime: new Date()
          });
          return;
        }
      }

      // Check for captcha
      const captchaElement = await page.$('[name="captcha_response"]');
      if (captchaElement) {
        if (session.formData.autoSolveCaptcha) {
          // TODO: Implement captcha solving
          this.updateSession(sessionId, {
            status: 'error',
            message: 'Captcha detected - auto solving not implemented',
            errorType: 'captcha',
            endTime: new Date()
          });
          return;
        } else {
          this.updateSession(sessionId, {
            status: 'error',
            message: 'Captcha detected',
            errorType: 'captcha',
            endTime: new Date()
          });
          return;
        }
      }

      // Check if login was successful
      const isLoggedIn = await page.evaluate(() => {
        return !document.querySelector('#email') && document.querySelector('[data-testid="blue_bar_profile_link"]');
      });

      if (isLoggedIn) {
        // Get cookies
        const cookies = await page.cookies();
        const cookiesString = JSON.stringify(cookies);

        // Get IP (simulated)
        const ip = session.formData.proxy || '127.0.0.1';

        this.updateSession(sessionId, {
          status: 'success',
          message: 'Login successful',
          cookies: cookiesString,
          ip,
          endTime: new Date()
        });

        // Send success notification
        this.notificationService.sendNotification({
          type: 'success',
          title: 'Login Successful',
          message: `Successfully logged in to ${session.formData.email}`,
          sessionId
        });

      } else {
        // Check for specific error messages
        const errorText = await page.evaluate(() => {
          const errorElement = document.querySelector('[data-testid="error_message"]');
          return errorElement ? errorElement.textContent : '';
        });

        let errorType = 'error';
        if (errorText.includes('password')) {
          errorType = 'wrong_password';
        } else if (errorText.includes('email')) {
          errorType = 'wrong_account';
        }

        this.updateSession(sessionId, {
          status: 'error',
          message: errorText || 'Login failed',
          errorType,
          endTime: new Date()
        });
      }

    } catch (error) {
      logger.error('Login process error:', error);
      this.updateSession(sessionId, {
        status: 'error',
        message: error.message,
        endTime: new Date()
      });
    } finally {
      // Clean up
      if (browser) {
        await browser.close();
      }

      // Remove session after some time
      setTimeout(() => {
        this.activeSessions.delete(sessionId);
      }, 300000); // 5 minutes
    }
  }

  private updateSession(sessionId: string, updates: Partial<LoginSession>): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      this.activeSessions.set(sessionId, { ...session, ...updates });
    }
  }

  // Get active sessions count
  public getActiveSessionsCount(): number {
    return this.activeSessions.size;
  }

  // Get all active sessions
  public getActiveSessions(): LoginSession[] {
    return Array.from(this.activeSessions.values());
  }
}

export { AutoLoginController };