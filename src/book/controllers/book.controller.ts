import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Post('/:bookId')
  async addBookReview(@Param('bookId') bookId: string): Promise<any> {
    return await this.bookService.addBookReview(bookId);
  }
}
