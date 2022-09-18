import { HttpException, HttpStatus } from '@nestjs/common';

export class NotExistUserException extends HttpException {
  constructor() {
    super('존재하지 않는 사용자입니다.', HttpStatus.UNAUTHORIZED);
  }
}
