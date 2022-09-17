import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/auth/dto/payload.dto';

export const UserPayload = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    try {
      const jwtService = new JwtService({});
      const request = ctx.switchToHttp().getRequest();
      const cookie = data ? request.cookies?.['accessToken'] : request.cookies;

      const jwt: Payload = await jwtService.verifyAsync(cookie.accessToken, {
        issuer: 'string',
        secret: 'secret',
      });

      return jwt;
    } catch (error) {
      console.error(error);
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  },
);
