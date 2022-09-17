import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_PROVIDER = 'RedisProviders';
export const RedisProviders = {
  provide: REDIS_PROVIDER,
  useFactory: async () => {
    const logger = new Logger(REDIS_PROVIDER);
    const port = 6379;
    const host = 'localhost';
    const pw = '0073';
    const redis = new Redis(`redis://:${pw}@${host}:${port}/`);

    redis.on('connect', () => {
      logger.log('The Redis Connection is Successful.');
    });

    redis.on('error', (error) => {
      logger.error(`Redis got Error :: ${error.message}`);
    });

    redis.on('close', () => {
      logger.warn('Redis Connection Closed.');
    });

    return redis;
  },
  inject: [],
};
