import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export class RefreshTokenConfig implements JwtSignOptions {
  secret: string;
  issuer: string;
  privateKey: string;
  expiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.secret = 'string';
    this.issuer = 'string';
    this.privateKey = 'string';
    this.expiresIn = 1000000;
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
