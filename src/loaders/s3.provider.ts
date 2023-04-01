import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

export const S3_UPLOADER_PROVIDER_NAME = 'S3Uploader';
export const S3Provider = {
  provide: S3_UPLOADER_PROVIDER_NAME,
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger(S3_UPLOADER_PROVIDER_NAME);

    try {
      const s3 = new S3({
        apiVersion: 'latest',
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
        region: configService.get('AWS_REGION'),
        s3ForcePathStyle: true,
      });

      return s3;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  inject: [ConfigService],
};
