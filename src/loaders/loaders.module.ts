import { Global, Module } from '@nestjs/common';
import { RedisProviders } from './redis.providers';
import { S3Provider } from './s3.providers';

@Global()
@Module({
  providers: [RedisProviders, S3Provider],
  exports: [RedisProviders, S3Provider],
})
export class LoadersModule {}
