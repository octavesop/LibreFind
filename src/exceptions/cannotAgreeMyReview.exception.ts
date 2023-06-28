import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotAgreeMyReviewException extends HttpException {
  constructor() {
    super('자신의 리뷰에는 좋아요를 할 수 없습니다.', HttpStatus.BAD_REQUEST);
  }
}
