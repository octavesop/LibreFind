import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistReviewException extends HttpException {
  constructor() {
    super(
      '이미 존재하는 리뷰입니다. 리뷰 수정을 사용하세요.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
