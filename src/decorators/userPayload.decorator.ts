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
      const cookie = data
        ? request.cookies?.[process.env.ACCESS_TOKEN_NAME]
        : request.cookies;

      const jwt: Payload = await jwtService.verifyAsync(cookie.accessToken, {
        issuer: process.env.ACCESS_TOKEN_ISSUER,
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      return jwt;
    } catch (error) {
      console.error(error);
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  },
);
