import { HttpException, HttpStatus } from '@nestjs/common';

export class ExpiredCodeException extends HttpException {
  constructor() {
    super(
      '코드값이 만료되었거나 존재하지 않습니다. 다시 신청해주십시오.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
