import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwtAuthGuard.guard';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AccessTokenConfig } from '../configurations/accessToken.config';
import { AccessTokenCookieConfig } from '../configurations/accessTokenCookie.config';
import { RefreshTokenCookieConfig } from '../configurations/refreshTokenConfig.config';
import { RefreshTokenConfig } from '../configurations/refreshToken.config';

@Controller()
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,

    private readonly accessTokenConfig: AccessTokenConfig,
    private readonly accessTokenCookieConfig: AccessTokenCookieConfig,
    private readonly refreshTokenConfig: RefreshTokenConfig,
    private readonly refreshTokenCookieConfig: RefreshTokenCookieConfig,
  ) {}

  @ApiOperation({ description: '회원가입' })
  @ApiCreatedResponse({ type: User })
  @HttpCode(HttpStatus.CREATED)
  @Post('/signUp')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    return await this.authService.signUp(request);
  }

  @ApiOperation({ description: '로그인' })
  @Post('/signIn')
  async signIn(
    @Body() request: SignInRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User | HttpException> {
    const userInfo = await this.authService.signIn(request);
    const accessToken = await this.jwtService.signAsync(
      {
        userUid: userInfo.userUid,
        userId: userInfo.userId,
      },
      this.accessTokenConfig.make(),
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        userUid: userInfo.userUid,
      },
      this.refreshTokenConfig.make(),
    );
    res.cookie('accessToken', accessToken, this.accessTokenCookieConfig.make());
    res.cookie(
      'refreshToken',
      refreshToken,
      this.refreshTokenCookieConfig.make(),
    );
    return userInfo;
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return;
  }
}
