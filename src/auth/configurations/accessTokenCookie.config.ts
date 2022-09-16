import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class AccessTokenCookieConfig implements CookieOptions {
  readonly maxAge: number;
  readonly httpOnly: boolean;
  readonly path: string;
  readonly secure: boolean;
  readonly sameSite: boolean | 'lax' | 'strict' | 'none';

  constructor(private readonly configService: ConfigService) {
    this.maxAge = 10000000;
    this.httpOnly = true;
    this.path = '/';
    this.secure = false;
    this.sameSite = false;
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
