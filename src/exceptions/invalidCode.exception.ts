import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCodeException extends HttpException {
  constructor() {
    super('올바르지 않은 코드값입니다.', HttpStatus.BAD_REQUEST);
  }
}
