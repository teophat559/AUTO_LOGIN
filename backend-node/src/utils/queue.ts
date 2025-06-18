import Bull from 'bull';
import { EventEmitter } from 'events';
import { logger } from './logger';
import { HTTP_STATUS } from './constants';
import { AppError } from './error';
import { CacheService } from '../services/CacheService';

// Queue options
export interface QueueOptions {
  name: string;
  redis?: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
  };
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'fixed' | 'exponential';
      delay: number;
    };
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
  };
}

// Job data
export interface JobData {
  id: string;
  type: string;
  data: any;
  priority?: number;
  timestamp: number;
  metadata?: {
    source?: string;
    action?: string;
    category?: string;
    tags?: string[];
  };
}

// Job result
export interface JobResult {
  id: string;
  status: 'completed' | 'failed' | 'delayed' | 'active' | 'waiting';
  result?: any;
  error?: string;
  timestamp: number;
  duration?: number;
}

// Queue class
class QueueManager extends EventEmitter {
  private static instance: QueueManager;
  private queues: Map<string, Bull.Queue>;
  private cacheService: CacheService;

  private constructor() {
    super();
    this.queues = new Map();
    this.cacheService = CacheService.getInstance();
  }

  public static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  // Create queue
  public createQueue(options: QueueOptions): Bull.Queue {
    try {
      if (this.queues.has(options.name)) {
        throw new AppError(`Queue ${options.name} already exists`, HTTP_STATUS.CONFLICT);
      }

      const queue = new Bull(options.name, {
        redis: options.redis,
        limiter: options.limiter,
        defaultJobOptions: options.defaultJobOptions
      });

      this.queues.set(options.name, queue);
      this.setupQueueEvents(queue);
      this.emit('queue:created', options.name);

      return queue;
    } catch (error) {
      logger.error('Error creating queue:', error);
      throw new AppError('Error creating queue', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get queue
  public getQueue(name: string): Bull.Queue | undefined {
    return this.queues.get(name);
  }

  // Add job
  public async addJob(
    queueName: string,
    data: JobData,
    options: Bull.JobOptions = {}
  ): Promise<Bull.Job> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      const job = await queue.add(data, {
        ...options,
        jobId: data.id,
        timestamp: data.timestamp,
        priority: data.priority
      });

      this.emit('job:added', { queueName, jobId: job.id });
      return job;
    } catch (error) {
      logger.error('Error adding job:', error);
      throw new AppError('Error adding job', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Process jobs
  public processJobs(
    queueName: string,
    processor: (job: Bull.Job) => Promise<any>
  ): void {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      queue.process(async (job) => {
        try {
          const startTime = Date.now();
          const result = await processor(job);
          const duration = Date.now() - startTime;

          const jobResult: JobResult = {
            id: job.id,
            status: 'completed',
            result,
            timestamp: Date.now(),
            duration
          };

          await this.cacheService.set(`job:${job.id}`, jobResult);
          this.emit('job:completed', { queueName, jobId: job.id, result });

          return result;
        } catch (error) {
          const jobResult: JobResult = {
            id: job.id,
            status: 'failed',
            error: error.message,
            timestamp: Date.now()
          };

          await this.cacheService.set(`job:${job.id}`, jobResult);
          this.emit('job:failed', { queueName, jobId: job.id, error });

          throw error;
        }
      });
    } catch (error) {
      logger.error('Error processing jobs:', error);
      throw new AppError('Error processing jobs', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get job
  public async getJob(queueName: string, jobId: string): Promise<Bull.Job | null> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      return await queue.getJob(jobId);
    } catch (error) {
      logger.error('Error getting job:', error);
      throw new AppError('Error getting job', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get jobs
  public async getJobs(
    queueName: string,
    status: Bull.JobStatus = 'waiting',
    start = 0,
    end = 100
  ): Promise<Bull.Job[]> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      return await queue.getJobs([status], start, end);
    } catch (error) {
      logger.error('Error getting jobs:', error);
      throw new AppError('Error getting jobs', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Remove job
  public async removeJob(queueName: string, jobId: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        await this.cacheService.del(`job:${jobId}`);
        this.emit('job:removed', { queueName, jobId });
      }
    } catch (error) {
      logger.error('Error removing job:', error);
      throw new AppError('Error removing job', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Clean queue
  public async cleanQueue(
    queueName: string,
    status: Bull.JobStatus,
    age: number
  ): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      await queue.clean(age, status);
      this.emit('queue:cleaned', { queueName, status, age });
    } catch (error) {
      logger.error('Error cleaning queue:', error);
      throw new AppError('Error cleaning queue', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Pause queue
  public async pauseQueue(queueName: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      await queue.pause();
      this.emit('queue:paused', queueName);
    } catch (error) {
      logger.error('Error pausing queue:', error);
      throw new AppError('Error pausing queue', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Resume queue
  public async resumeQueue(queueName: string): Promise<void> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      await queue.resume();
      this.emit('queue:resumed', queueName);
    } catch (error) {
      logger.error('Error resuming queue:', error);
      throw new AppError('Error resuming queue', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Get queue stats
  public async getQueueStats(queueName: string): Promise<Bull.QueueCounts> {
    try {
      const queue = this.getQueue(queueName);
      if (!queue) {
        throw new AppError(`Queue ${queueName} not found`, HTTP_STATUS.NOT_FOUND);
      }

      return await queue.getJobCounts();
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      throw new AppError('Error getting queue stats', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Setup queue events
  private setupQueueEvents(queue: Bull.Queue): void {
    queue.on('error', (error) => {
      logger.error('Queue error:', error);
      this.emit('queue:error', { queueName: queue.name, error });
    });

    queue.on('failed', (job, error) => {
      logger.error('Job failed:', { jobId: job.id, error });
      this.emit('job:failed', { queueName: queue.name, jobId: job.id, error });
    });

    queue.on('stalled', (job) => {
      logger.warn('Job stalled:', { jobId: job.id });
      this.emit('job:stalled', { queueName: queue.name, jobId: job.id });
    });

    queue.on('completed', (job, result) => {
      logger.info('Job completed:', { jobId: job.id, result });
      this.emit('job:completed', { queueName: queue.name, jobId: job.id, result });
    });

    queue.on('active', (job) => {
      logger.info('Job active:', { jobId: job.id });
      this.emit('job:active', { queueName: queue.name, jobId: job.id });
    });

    queue.on('waiting', (jobId) => {
      logger.info('Job waiting:', { jobId });
      this.emit('job:waiting', { queueName: queue.name, jobId });
    });

    queue.on('delayed', (job) => {
      logger.info('Job delayed:', { jobId: job.id });
      this.emit('job:delayed', { queueName: queue.name, jobId: job.id });
    });

    queue.on('progress', (job, progress) => {
      logger.info('Job progress:', { jobId: job.id, progress });
      this.emit('job:progress', { queueName: queue.name, jobId: job.id, progress });
    });
  }
}

export const queueManager = QueueManager.getInstance();