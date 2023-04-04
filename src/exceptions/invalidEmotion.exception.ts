import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEmotionException extends HttpException {
  constructor() {
    super('올바르지 못한 감정 분류입니다.', HttpStatus.BAD_REQUEST);
  }
}
