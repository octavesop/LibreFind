import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisProviders } from '../loaders/redis.providers';
import { User } from '../user/entities/user.entity';
import { AccessTokenConfig } from './configurations/accessToken.config';
import { AccessTokenCookieConfig } from './configurations/accessTokenCookie.config';
import { RefreshTokenConfig } from './configurations/refreshToken.config';
import { RefreshTokenCookieConfig } from './configurations/refreshTokenCookie.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    RedisProviders,
    AuthService,
    AccessTokenConfig,
    AccessTokenCookieConfig,
    RefreshTokenConfig,
    RefreshTokenCookieConfig,
    JwtService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
