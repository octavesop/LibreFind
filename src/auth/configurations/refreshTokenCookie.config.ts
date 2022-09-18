import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class RefreshTokenCookieConfig implements CookieOptions {
  readonly maxAge: number;
  readonly httpOnly: boolean;
  readonly path: string;
  readonly secure: boolean;
  readonly sameSite: boolean | 'lax' | 'strict' | 'none';

  constructor(private readonly configService: ConfigService) {
    this.maxAge = this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN');
    this.httpOnly = this.configService.get<boolean>('COOKIE_HTTP_ONLY');
    this.path = this.configService.get<string>('COOKIE_PATH');
    this.secure = this.configService.get<boolean>('COOKIE_SECURE');
    this.sameSite = this.configService.get<'lax'>('COOKIE_SAME_SITE');
  }

  make(): CookieOptions {
    return {
      maxAge: this.maxAge,
      httpOnly: this.httpOnly,
      path: this.path,
      secure: this.secure,
      sameSite: this.sameSite,
    };
  }
}
