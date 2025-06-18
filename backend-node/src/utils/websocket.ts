import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { CacheService } from '../services/CacheService';

// WebSocket options
export interface WebSocketOptions {
  port?: number;
  path?: string;
  server?: any;
  pingInterval?: number;
  pingTimeout?: number;
  maxPayload?: number;
  clientTracking?: boolean;
}

// WebSocket client
export interface WebSocketClient {
  id: string;
  ws: WebSocket;
  isAlive: boolean;
  subscriptions: Set<string>;
  metadata?: {
    userId?: string;
    groupId?: string;
    roles?: string[];
    tags?: string[];
  };
}

// WebSocket message
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  metadata?: {
    source?: string;
    action?: string;
    category?: string;
    tags?: string[];
  };
}

// WebSocket class
class WebSocketManager extends EventEmitter {
  private static instance: WebSocketManager;
  private wss: WebSocket.Server;
  private clients: Map<string, WebSocketClient>;
  private options: WebSocketOptions;
  private cacheService: CacheService;
  private pingInterval: NodeJS.Timeout;

  private constructor(options: WebSocketOptions = {}) {
    super();
    this.options = {
      port: options.port || parseInt(process.env.WS_PORT || '8080'),
      path: options.path || '/ws',
      server: options.server,
      pingInterval: options.pingInterval || 30000,
      pingTimeout: options.pingTimeout || 5000,
      maxPayload: options.maxPayload || 1024 * 1024,
      clientTracking: options.clientTracking !== false
    };

    this.clients = new Map();
    this.cacheService = CacheService.getInstance();
    this.setupWebSocketServer();
    this.startPingInterval();
  }

  public static getInstance(options?: WebSocketOptions): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager(options);
    }
    return WebSocketManager.instance;
  }

  // Setup WebSocket server
  private setupWebSocketServer(): void {
    this.wss = new WebSocket.Server({
      port: this.options.port,
      path: this.options.path,
      server: this.options.server,
      maxPayload: this.options.maxPayload,
      clientTracking: this.options.clientTracking
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.wss.on('error', this.handleError.bind(this));
    this.wss.on('close', this.handleClose.bind(this));
  }

  // Handle new connection
  private handleConnection(ws: WebSocket, req: any): void {
    try {
      const clientId = this.generateClientId();
      const client: WebSocketClient = {
        id: clientId,
        ws,
        isAlive: true,
        subscriptions: new Set(),
        metadata: this.extractMetadata(req)
      };

      this.clients.set(clientId, client);
      this.setupClientEvents(client);
      this.emit('client:connected', { clientId, metadata: client.metadata });
    } catch (error) {
      logger.error('Error handling connection:', error);
      this.emit('error', error);
    }
  }

  // Handle WebSocket error
  private handleError(error: Error): void {
    logger.error('WebSocket server error:', error);
    this.emit('error', error);
  }

  // Handle WebSocket close
  private handleClose(): void {
    logger.info('WebSocket server closed');
    this.emit('close');
  }

  // Setup client events
  private setupClientEvents(client: WebSocketClient): void {
    client.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = this.parseMessage(data);
        this.handleMessage(client, message);
      } catch (error) {
        logger.error('Error handling message:', error);
        this.sendError(client, error);
      }
    });

    client.ws.on('pong', () => {
      client.isAlive = true;
    });

    client.ws.on('close', () => {
      this.handleDisconnection(client);
    });

    client.ws.on('error', (error: Error) => {
      logger.error('Client error:', error);
      this.emit('client:error', { clientId: client.id, error });
    });
  }

  // Handle client message
  private handleMessage(client: WebSocketClient, message: WebSocketMessage): void {
    try {
      switch (message.type) {
        case 'subscribe':
          this.handleSubscribe(client, message.data);
          break;
        case 'unsubscribe':
          this.handleUnsubscribe(client, message.data);
          break;
        case 'publish':
          this.handlePublish(client, message);
          break;
        default:
          this.emit('message', { clientId: client.id, message });
      }
    } catch (error) {
      logger.error('Error handling message:', error);
      this.sendError(client, error);
    }
  }

  // Handle client subscription
  private handleSubscribe(client: WebSocketClient, channels: string[]): void {
    try {
      for (const channel of channels) {
        client.subscriptions.add(channel);
      }
      this.sendSuccess(client, 'subscribed', { channels });
      this.emit('client:subscribed', { clientId: client.id, channels });
    } catch (error) {
      logger.error('Error handling subscription:', error);
      this.sendError(client, error);
    }
  }

  // Handle client unsubscription
  private handleUnsubscribe(client: WebSocketClient, channels: string[]): void {
    try {
      for (const channel of channels) {
        client.subscriptions.delete(channel);
      }
      this.sendSuccess(client, 'unsubscribed', { channels });
      this.emit('client:unsubscribed', { clientId: client.id, channels });
    } catch (error) {
      logger.error('Error handling unsubscription:', error);
      this.sendError(client, error);
    }
  }

  // Handle client publish
  private handlePublish(client: WebSocketClient, message: WebSocketMessage): void {
    try {
      const { channel, data } = message.data;
      this.broadcast(channel, {
        type: 'message',
        data,
        timestamp: Date.now(),
        metadata: {
          source: client.id,
          ...message.metadata
        }
      });
      this.emit('message:published', { clientId: client.id, channel, data });
    } catch (error) {
      logger.error('Error handling publish:', error);
      this.sendError(client, error);
    }
  }

  // Handle client disconnection
  private handleDisconnection(client: WebSocketClient): void {
    try {
      this.clients.delete(client.id);
      this.emit('client:disconnected', { clientId: client.id, metadata: client.metadata });
    } catch (error) {
      logger.error('Error handling disconnection:', error);
      this.emit('error', error);
    }
  }

  // Start ping interval
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const client = this.findClientByWebSocket(ws);
        if (client) {
          if (!client.isAlive) {
            return ws.terminate();
          }
          client.isAlive = false;
          ws.ping();
        }
      });
    }, this.options.pingInterval);
  }

  // Find client by WebSocket
  private findClientByWebSocket(ws: WebSocket): WebSocketClient | undefined {
    return Array.from(this.clients.values()).find(client => client.ws === ws);
  }

  // Generate client ID
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extract metadata from request
  private extractMetadata(req: any): WebSocketClient['metadata'] {
    try {
      const metadata: WebSocketClient['metadata'] = {};
      if (req.headers['user-id']) {
        metadata.userId = req.headers['user-id'];
      }
      if (req.headers['group-id']) {
        metadata.groupId = req.headers['group-id'];
      }
      if (req.headers['roles']) {
        metadata.roles = req.headers['roles'].split(',');
      }
      if (req.headers['tags']) {
        metadata.tags = req.headers['tags'].split(',');
      }
      return metadata;
    } catch (error) {
      logger.error('Error extracting metadata:', error);
      return {};
    }
  }

  // Parse message
  private parseMessage(data: WebSocket.Data): WebSocketMessage {
    try {
      const message = JSON.parse(data.toString());
      if (!message.type) {
        throw new Error('Message type is required');
      }
      return {
        type: message.type,
        data: message.data,
        timestamp: Date.now(),
        metadata: message.metadata
      };
    } catch (error) {
      logger.error('Error parsing message:', error);
      throw new Error('Invalid message format');
    }
  }

  // Send message to client
  public send(client: WebSocketClient, message: WebSocketMessage): void {
    try {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    } catch (error) {
      logger.error('Error sending message:', error);
      this.emit('error', error);
    }
  }

  // Send success message
  public sendSuccess(
    client: WebSocketClient,
    type: string,
    data: any
  ): void {
    this.send(client, {
      type: 'success',
      data: { type, ...data },
      timestamp: Date.now()
    });
  }

  // Send error message
  public sendError(client: WebSocketClient, error: Error): void {
    this.send(client, {
      type: 'error',
      data: {
        message: error.message,
        code: error.name
      },
      timestamp: Date.now()
    });
  }

  // Broadcast message to channel
  public broadcast(channel: string, message: WebSocketMessage): void {
    try {
      this.clients.forEach(client => {
        if (client.subscriptions.has(channel)) {
          this.send(client, message);
        }
      });
    } catch (error) {
      logger.error('Error broadcasting message:', error);
      this.emit('error', error);
    }
  }

  // Get connected clients
  public getClients(): WebSocketClient[] {
    return Array.from(this.clients.values());
  }

  // Get client by ID
  public getClient(clientId: string): WebSocketClient | undefined {
    return this.clients.get(clientId);
  }

  // Get clients by metadata
  public getClientsByMetadata(metadata: Partial<WebSocketClient['metadata']>): WebSocketClient[] {
    return this.getClients().filter(client => {
      if (metadata.userId && client.metadata?.userId !== metadata.userId) return false;
      if (metadata.groupId && client.metadata?.groupId !== metadata.groupId) return false;
      if (metadata.roles && !metadata.roles.every(role => client.metadata?.roles?.includes(role))) return false;
      if (metadata.tags && !metadata.tags.every(tag => client.metadata?.tags?.includes(tag))) return false;
      return true;
    });
  }

  // Close WebSocket server
  public async close(): Promise<void> {
    try {
      clearInterval(this.pingInterval);
      this.clients.forEach(client => {
        client.ws.close();
      });
      this.clients.clear();
      await new Promise<void>((resolve, reject) => {
        this.wss.close(error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
      this.emit('close');
    } catch (error) {
      logger.error('Error closing WebSocket server:', error);
      throw new AppError('Error closing WebSocket server', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export const wsManager = WebSocketManager.getInstance();