import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotBeFriendWithMyselfException extends HttpException {
  constructor() {
    super('자기 자신은 친구로 등록할 수 없습니다.', HttpStatus.BAD_REQUEST);
  }
}
