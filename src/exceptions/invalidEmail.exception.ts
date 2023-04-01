import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmailException extends HttpException {
  constructor() {
    super('올바르지 못한 이메일 타입입니다.', HttpStatus.BAD_REQUEST);
  }
}
