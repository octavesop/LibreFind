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

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
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
