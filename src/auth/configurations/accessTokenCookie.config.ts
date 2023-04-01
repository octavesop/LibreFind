import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class AccessTokenCookieConfig implements CookieOptions {
  readonly maxAge: number;
  readonly httpOnly: boolean;
  readonly path: string;
  readonly secure: boolean;
  readonly sameSite: 'lax' | 'strict' | 'none';

  constructor(private readonly configService: ConfigService) {
    this.maxAge = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
    this.httpOnly =
      this.configService.get('COOKIE_HTTP_ONLY') === true ? true : false;
    this.path = this.configService.get('COOKIE_PATH');
    this.secure =
      this.configService.get('COOKIE_SECURE') === true ? true : false;
    this.sameSite = this.configService.get('COOKIE_SAME_SITE');
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
