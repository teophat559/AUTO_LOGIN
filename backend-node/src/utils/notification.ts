import nodemailer from 'nodemailer';
import { logger } from './logger';
import { TIME } from './constants';
import { EventEmitter } from 'events';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { NotificationService } from '../services/NotificationService';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

interface NotificationOptions {
  type: 'email' | 'sms' | 'webhook';
  data: any;
  retry?: number;
  delay?: number;
}

// Notification types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Notification priority
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: any;
  timestamp: number;
  read: boolean;
  userId?: string;
  groupId?: string;
  metadata?: {
    source?: string;
    action?: string;
    category?: string;
    tags?: string[];
  };
}

// Notification options
export interface NotificationOptions {
  type?: NotificationType;
  priority?: NotificationPriority;
  data?: any;
  userId?: string;
  groupId?: string;
  metadata?: {
    source?: string;
    action?: string;
    category?: string;
    tags?: string[];
  };
}

class NotificationManager extends EventEmitter {
  private static instance: NotificationManager;
  private notifications: Map<string, Notification>;
  private notificationService: NotificationService;

  private constructor() {
    super();
    this.notifications = new Map();
    this.notificationService = NotificationService.getInstance();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Create notification
  public async createNotification(
    title: string,
    message: string,
    options: NotificationOptions = {}
  ): Promise<Notification> {
    try {
      const notification: Notification = {
        id: this.generateId(),
        type: options.type || NotificationType.INFO,
        priority: options.priority || NotificationPriority.MEDIUM,
        title,
        message,
        data: options.data,
        timestamp: Date.now(),
        read: false,
        userId: options.userId,
        groupId: options.groupId,
        metadata: options.metadata
      };

      this.notifications.set(notification.id, notification);
      await this.notificationService.sendNotification(notification);
      this.emit('notification:created', notification);

      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw new AppError('Error creating notification', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get notification
  public getNotification(id: string): Notification | undefined {
    return this.notifications.get(id);
  }

  // Get notifications
  public getNotifications(
    userId?: string,
    groupId?: string,
    type?: NotificationType,
    priority?: NotificationPriority,
    read?: boolean
  ): Notification[] {
    return Array.from(this.notifications.values()).filter(notification => {
      if (userId && notification.userId !== userId) return false;
      if (groupId && notification.groupId !== groupId) return false;
      if (type && notification.type !== type) return false;
      if (priority && notification.priority !== priority) return false;
      if (read !== undefined && notification.read !== read) return false;
      return true;
    });
  }

  // Mark notification as read
  public async markAsRead(id: string): Promise<void> {
    try {
      const notification = this.notifications.get(id);
      if (!notification) {
        throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
      }

      notification.read = true;
      await this.notificationService.updateNotification(notification);
      this.emit('notification:read', notification);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw new AppError('Error marking notification as read', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Mark all notifications as read
  public async markAllAsRead(userId?: string, groupId?: string): Promise<void> {
    try {
      const notifications = this.getNotifications(userId, groupId, undefined, undefined, false);
      for (const notification of notifications) {
        notification.read = true;
        await this.notificationService.updateNotification(notification);
        this.emit('notification:read', notification);
      }
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw new AppError('Error marking all notifications as read', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete notification
  public async deleteNotification(id: string): Promise<void> {
    try {
      const notification = this.notifications.get(id);
      if (!notification) {
        throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
      }

      this.notifications.delete(id);
      await this.notificationService.deleteNotification(id);
      this.emit('notification:deleted', notification);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw new AppError('Error deleting notification', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete all notifications
  public async deleteAllNotifications(userId?: string, groupId?: string): Promise<void> {
    try {
      const notifications = this.getNotifications(userId, groupId);
      for (const notification of notifications) {
        this.notifications.delete(notification.id);
        await this.notificationService.deleteNotification(notification.id);
        this.emit('notification:deleted', notification);
      }
    } catch (error) {
      logger.error('Error deleting all notifications:', error);
      throw new AppError('Error deleting all notifications', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Subscribe to notifications
  public subscribe(
    userId: string,
    callback: (notification: Notification) => void
  ): void {
    this.on(`notification:${userId}`, callback);
  }

  // Unsubscribe from notifications
  public unsubscribe(
    userId: string,
    callback: (notification: Notification) => void
  ): void {
    this.off(`notification:${userId}`, callback);
  }

  // Generate notification ID
  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const notificationManager = NotificationManager.getInstance();