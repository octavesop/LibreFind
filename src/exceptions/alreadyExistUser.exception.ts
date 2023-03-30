import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistUserException extends HttpException {
  constructor(userId: string) {
    super(
      `${userId}는 이미 사용중이므로 사용할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
