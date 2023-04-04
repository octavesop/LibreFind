import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistEmotionException extends HttpException {
  constructor(requestEmotionName: string, emotionName: string) {
    super(
      `${requestEmotionName}은/는 이미 존재하는 감정 분류입니다. ${emotionName}을 사용해보세요.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
