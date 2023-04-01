import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_PROVIDER = 'RedisProviders';
export const RedisProviders = {
  provide: REDIS_PROVIDER,
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger(REDIS_PROVIDER);
    const port = configService.get('REDIS_PORT');
    const host = configService.get('REDIS_HOST');
    const pw = configService.get('REDIS_PASSWORD');
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
  inject: [ConfigService],
};
