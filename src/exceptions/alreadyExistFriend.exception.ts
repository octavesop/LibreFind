import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistFriendException extends HttpException {
  constructor() {
    super('이미 존재하는 친구입니다.', HttpStatus.BAD_REQUEST);
  }
}
