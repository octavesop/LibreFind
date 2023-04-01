import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SES } from 'aws-sdk';

export const SES_SENDER_PROVIDER_NAME = 'SESSender';
export const SESProvider = {
  provide: SES_SENDER_PROVIDER_NAME,
  useFactory: async (configService: ConfigService) => {
    const logger: Readonly<Logger> = new Logger(SES_SENDER_PROVIDER_NAME);

    try {
      const ses = new SES({
        apiVersion: 'latest',
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY'),
        region: configService.get('AWS_REGION'),
      });

      return ses;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  inject: [ConfigService],
};
