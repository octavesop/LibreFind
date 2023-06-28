import { HttpException, HttpStatus } from '@nestjs/common';

export class NotExistReviewException extends HttpException {
  constructor() {
    super('존재하지 않는 리뷰입니다.', HttpStatus.BAD_REQUEST);
  }
}
