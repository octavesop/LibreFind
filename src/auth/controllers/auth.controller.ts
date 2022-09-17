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
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AccessTokenConfig } from '../configurations/accessToken.config';
import { AccessTokenCookieConfig } from '../configurations/accessTokenCookie.config';
import { RefreshTokenCookieConfig } from '../configurations/refreshTokenConfig.config';
import { RefreshTokenConfig } from '../configurations/refreshToken.config';
import { Cookies } from '../../decorators/cookies.decorator';

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
    if (!userInfo) {
      throw new Error('로그인에 실패했습니다.');
    }
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

  @ApiOperation({ description: 'accessToken 리프레시' })
  @HttpCode(HttpStatus.CREATED)
  @Post('/refresh')
  async refresh(
    @Cookies('refreshToken') rawRefreshTokenValue: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    try {
      const rawRefreshToken: {
        userUid: number;
        iat: number;
        exp: number;
        iss: string;
      } = await this.jwtService.verifyAsync(
        rawRefreshTokenValue,
        this.refreshTokenConfig.make(),
      );

      const userInfo = await this.authService.findUserByUserUid(
        rawRefreshToken.userUid,
      );
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
      res.cookie(
        'accessToken',
        accessToken,
        this.accessTokenCookieConfig.make(),
      );
      res.cookie(
        'refreshToken',
        refreshToken,
        this.refreshTokenCookieConfig.make(),
      );
      return userInfo;
    } catch (error) {
      if ((error.message = 'jwt must be provided')) {
        throw new HttpException(
          '토큰이 만료되었거나 존재하지 않습니다. 다시 로그인해주세요.',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
      { secret: 'secret' },
    );
    res.cookie('accesToken', accessToken, {});
    res.cookie('refreshToken', accessToken, {});
    return userInfo;
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return;
  }
}
