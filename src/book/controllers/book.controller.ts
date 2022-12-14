import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Payload } from '../../auth/dto/payload.dto';
import { UserPayload } from '../../decorators/userPayload.decorator';
import { BookRequest } from '../dto/bookRequest.dto';
import { BookService } from '../services/book.service';

@ApiTags('Book')
@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/')
  async fetchBookListBySearchKeyword(
    @Query('searchKeyword') searchKeyword: string,
  ): Promise<any> {
    return await this.bookService.fetchBookListBySearchKeyword(searchKeyword);
  }

  @Post('/')
  async addBookReview(
    @Body() request: BookRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<any> {
    return await this.bookService.addBookReview(request, userInfo.userUid);
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
