import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main');
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle('LibreFind')
    .setVersion('0.0.1')
    .build();

  SwaggerModule.setup(
    '/swagger',
    app,
    SwaggerModule.createDocument(app, swaggerDocumentBuilder),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(
    configService.get<number>('PORT'),
    configService.get<string>('HOST'),
    async () => {
      logger.debug(
        `Application successfully started on ${await app.getUrl()} on ${configService.get<string>(
          'NODE_ENV',
        )}`,
      );
    },
  );
}
bootstrap();
