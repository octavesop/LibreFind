import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistGenreException extends HttpException {
  constructor(requestGenreName: string, genreName: string) {
    super(
      `${requestGenreName}은/는 이미 존재하는 장르입니다. ${genreName}을 사용해보세요.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
