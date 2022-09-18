import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginTriedOverFlowException extends HttpException {
  constructor() {
    super(
      '5회 이상 비밀번호를 틀렸습니다. 24시간 후 재시도하십시오.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
