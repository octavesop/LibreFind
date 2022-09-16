import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenConfig } from './auth/configurations/accessToken.config';
import { JwtAuthGuard } from './auth/guards/jwtAuthGuard.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { postgresqlProviders } from './loaders/postgresql.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRoot(postgresqlProviders),
    AuthModule,
    PassportModule,
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
