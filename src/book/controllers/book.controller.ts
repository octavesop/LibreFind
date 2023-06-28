import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Payload } from '../../auth/dto/payload.dto';
import { UserPayload } from '../../decorators/userPayload.decorator';
import { FetchBookListResponse } from '../dto/fetchBookListResponse.dto';
import { BookService } from '../services/book.service';

@ApiTags('Book - 책')
@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // TODO
  // 페이지네이션 추가
  @Get('/')
  async fetchBookListBySearchKeyword(
    @Query('searchKeyword') searchKeyword: string,
  ): Promise<FetchBookListResponse> {
    return await this.bookService.fetchBookListBySearchKeyword(searchKeyword);
  }

  @Delete('/:userMappingBooksUid')
  async deleteBookReview(
    @Param('userMappingBooksUid') userMappingBooksUid: number,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    return await this.bookService.deleteBookReview(
      userMappingBooksUid,
      userInfo.userUid,
    );
  }
}
