import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGenreException extends HttpException {
  constructor() {
    super('올바르지 못한 장르입니다.', HttpStatus.BAD_REQUEST);
  }
}
