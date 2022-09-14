import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: '회원가입' })
  @ApiCreatedResponse({ type: User })
  @HttpCode(HttpStatus.CREATED)
  @Post('/signUp')
  async signUp(@Body() request: SignUpRequest): Promise<User> {
    return await this.authService.signUp(request);
  }

  @ApiOperation({ description: '로그인' })
  @Post('/signIn')
  async signIn(@Body() request: SignInRequest): Promise<any> {
    return await this.authService.signIn(request);
  }

  @ApiOperation({ description: '로그아웃' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/signOut')
  async signOut(@Res({ passthrough: true }) res): Promise<void> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return;
  }
}
