import { HttpException, HttpStatus } from '@nestjs/common';

export class NotExistFriendException extends HttpException {
  constructor() {
    super('존재하지 않는 친구입니다.', HttpStatus.BAD_REQUEST);
  }
}
