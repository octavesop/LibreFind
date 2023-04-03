import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { BadgeModule } from './badge/badge.module';
import { BookModule } from './book/book.module';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { FriendModule } from './friend/friend.module';
import { GenreModule } from './genre/genre.module';
import { LoadersModule } from './loaders/loaders.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        port: configService.get('POSTGRESQL_PORT'),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize:
          configService.get('NODE_ENV') === 'development' ? true : false,
        logging: true,
        extra: {
          connectionLimit: 16,
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, {}),
    PassportModule,
    LoadersModule,

    AuthModule,
    BadgeModule,
    BookModule,
    FriendModule,
    GenreModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    JwtStrategy,
    AppService,
  ],
})
export class AppModule {}
