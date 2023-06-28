import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistAgreeException extends HttpException {
  constructor() {
    super('이미 좋아요 한 리뷰입니다.', HttpStatus.BAD_REQUEST);
  }
}
