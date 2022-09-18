import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AccessTokenConfig implements JwtSignOptions {
  secret: string;
  issuer: string;
  privateKey: string;
  expiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    this.issuer = this.configService.get<string>('ACCESS_TOKEN_ISSUER');
    this.privateKey = this.configService.get<string>(
      'ACCESS_TOKEN_PRIVATE_KEY',
    );
    this.expiresIn = this.configService.get<number>('ACCESS_TOKEN_EXPIRES_IN');
  }

  make(): JwtSignOptions {
    return {
      secret: this.secret,
      issuer: this.issuer,
      privateKey: this.privateKey,
      expiresIn: this.expiresIn,
    };
  }
}
