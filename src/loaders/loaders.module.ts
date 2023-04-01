import { Global, Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';
import { S3Provider } from './s3.provider';
import { SESProvider } from './ses.provider';
import { SESSendHelper } from './sesSend.helper';

@Global()
@Module({
  providers: [RedisProviders, S3Provider, SESProvider, SESSendHelper],
  exports: [RedisProviders, S3Provider, SESProvider, SESSendHelper],
})
export class LoadersModule {}
