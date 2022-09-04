import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CONNECTION_PROVIDER_NAME = 'RedisProviders';
export const RedisProviders = {
  provide: REDIS_CONNECTION_PROVIDER_NAME,
  useFactory: async () => {
    const logger = new Logger(REDIS_CONNECTION_PROVIDER_NAME);
    const port = 3306;
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
