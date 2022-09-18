import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordNotMatchException extends HttpException {
  constructor(number: number) {
    super(
      `아이디 혹은 비밀번호가 일치하지 않습니다. (${number}/5)`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
