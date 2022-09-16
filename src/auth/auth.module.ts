import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AccessTokenConfig } from './configurations/accessToken.config';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccessTokenCookieConfig } from './configurations/accessTokenCookie.config';
import { RefreshTokenConfig } from './configurations/refreshToken.config';
import { RefreshTokenCookieConfig } from './configurations/refreshTokenConfig.config';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
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
