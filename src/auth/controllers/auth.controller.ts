import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies } from '../../decorators/cookies.decorator';
import { AccessTokenInvalidException } from '../../exceptions/accessTokenInvalid.exception';
import { User } from '../../user/entities/user.entity';
import { AccessTokenConfig } from '../configurations/accessToken.config';
import { AccessTokenCookieConfig } from '../configurations/accessTokenCookie.config';
import { RefreshTokenConfig } from '../configurations/refreshToken.config';
import { RefreshTokenCookieConfig } from '../configurations/refreshTokenCookie.config';
import { EmailSignRequest } from '../dto/emailSignRequest.dto';
import { EmailVerifyRequest } from '../dto/emailVerifyRequest.dto';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { JwtAuthGuard } from '../guards/jwtAuthGuard.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('/auth')
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

  @ApiOperation({ description: '이메일 인증 메일 발송' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/signUp/email/sign')
  async signEmail(@Body() request: EmailSignRequest): Promise<void> {
    return await this.authService.signEmail(request);
  }

  @ApiOperation({ description: '이메일 인증 이후 계정 활성화' })
  @HttpCode(HttpStatus.OK)
  @Post('/signUp/email/verify')
  async verifyEmail(@Body() request: EmailVerifyRequest): Promise<User> {
    return await this.authService.verifyEmail(request);
  }

  @ApiOperation({ description: '로그인' })
  @Post('/signIn')
  async signIn(
    @Body() request: SignInRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const userInfo = await this.authService.signIn(request);
    const accessToken = this.jwtService.sign(
      {
        userUid: userInfo.userUid,
        userId: userInfo.userId,
      },
      this.accessTokenConfig.make(),
    );
    const refreshToken = this.jwtService.sign(
      {
        userUid: userInfo.userUid,
      },
      this.refreshTokenConfig.make(),
    );
    res.cookie(
      this.configService.get<string>('ACCESS_TOKEN_NAME'),
      accessToken,
      this.accessTokenCookieConfig.make(),
    );
    res.cookie(
      this.configService.get<string>('REFRESH_TOKEN_NAME'),
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
      } = this.jwtService.verify(
        rawRefreshTokenValue,
        this.refreshTokenConfig.make(),
      );

      const userInfo = await this.authService.findUserByUserUid(
        rawRefreshToken.userUid,
      );
      const accessToken = this.jwtService.sign(
        {
          userUid: userInfo.userUid,
          userId: userInfo.userId,
        },
        this.accessTokenConfig.make(),
      );
      const refreshToken = this.jwtService.sign(
        {
          userUid: userInfo.userUid,
        },
        this.refreshTokenConfig.make(),
      );
      res.cookie(
        this.configService.get<string>('ACCESS_TOKEN_NAME'),
        accessToken,
        this.accessTokenCookieConfig.make(),
      );
      res.cookie(
        this.configService.get<string>('REFRESH_TOKEN_NAME'),
        refreshToken,
        this.refreshTokenCookieConfig.make(),
      );
      return userInfo;
    } catch (error) {
      if ((error.message = 'jwt must be provided')) {
        throw new AccessTokenInvalidException();
      }
    }
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie(this.configService.get<string>('ACCESS_TOKEN_NAME'));
    res.clearCookie(this.configService.get<string>('REFRESH_TOKEN_NAME'));
    return;
  }
}
