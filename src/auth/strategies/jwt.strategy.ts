import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenInvalidException } from 'src/exceptions/accessTokenInvalid.exception';
import { User } from '../../user/entities/user.entity';
import { Payload } from '../dto/payload.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[
            configService.get<string>('ACCESS_TOKEN_NAME')
          ];
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: Payload): Promise<User> {
    try {
      const result = await this.authService.findUserByUserUid(payload.userUid);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new AccessTokenInvalidException();
    }
  }
}
