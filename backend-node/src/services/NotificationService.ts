import WebSocket from 'ws';
import { CacheService } from '../utils/cache';
import { ErrorHandler } from '../utils/error';
import { logger } from '../utils/logger';
import { TIME } from '../utils/constants';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  data?: any;
}

interface NotificationStats {
  total: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
  lastNotification: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private wss: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();
  private cacheService: CacheService;
  private notifications: Notification[] = [];
  private stats: NotificationStats = {
    total: 0,
    byType: {
      info: 0,
      success: 0,
      warning: 0,
      error: 0
    },
    lastNotification: new Date()
  };

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.wss = new WebSocket.Server({ noServer: true });
    this.setupWebSocket();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      // Send current notifications
      this.sendNotifications(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        logger.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  public getWebSocketServer(): WebSocket.Server {
    return this.wss;
  }

  public async sendNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Promise<void> {
    try {
      const fullNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date()
      };

      // Add to notifications array
      this.notifications.unshift(fullNotification);
      if (this.notifications.length > 100) {
        this.notifications.pop();
      }

      // Update stats
      this.stats.total++;
      this.stats.byType[notification.type]++;
      this.stats.lastNotification = fullNotification.timestamp;

      // Cache notifications and stats
      await this.cacheService.set('notifications', this.notifications, TIME.HOUR);
      await this.cacheService.set('notification:stats', this.stats, TIME.HOUR);

      // Broadcast to all clients
      this.broadcast(fullNotification);

      // Log notification
      logger.info(`Notification sent: ${notification.message}`, {
        type: notification.type,
        data: notification.data
      });
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  }

  public async getNotifications(limit: number = 50): Promise<Notification[]> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('notifications');
      if (cached) {
        return cached.slice(0, limit);
      }

      return this.notifications.slice(0, limit);
    } catch (error) {
      logger.error('Failed to get notifications:', error);
      throw error;
    }
  }

  public async getStats(): Promise<NotificationStats> {
    try {
      // Try to get from cache first
      const cached = await this.cacheService.get('notification:stats');
      if (cached) {
        return cached;
      }

      return this.stats;
    } catch (error) {
      logger.error('Failed to get notification stats:', error);
      throw error;
    }
  }

  public async clearNotifications(): Promise<void> {
    try {
      this.notifications = [];
      this.stats = {
        total: 0,
        byType: {
          info: 0,
          success: 0,
          warning: 0,
          error: 0
        },
        lastNotification: new Date()
      };

      // Clear cache
      await this.cacheService.del('notifications');
      await this.cacheService.del('notification:stats');

      // Notify clients
      this.broadcast({
        type: 'info',
        message: 'Notifications cleared'
      });
    } catch (error) {
      logger.error('Failed to clear notifications:', error);
      throw error;
    }
  }

  private broadcast(notification: Notification): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }

  private sendNotifications(client: WebSocket): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'info',
        message: 'Current notifications',
        data: this.notifications
      }));
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      return this.clients.size > 0;
    } catch (error) {
      logger.error('Failed to check notification connection:', error);
      return false;
    }
  }
}