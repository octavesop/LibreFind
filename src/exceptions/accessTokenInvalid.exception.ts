import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessTokenInvalidException extends HttpException {
  constructor() {
    super(
      '토큰이 만료되었거나 존재하지 않습니다. 다시 로그인해주십시오.',
      HttpStatus.FORBIDDEN,
    );
  }
}
