import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { Equal, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookRequest } from '../dto/bookRequest.dto';
import { UserMappingBooks } from '../entities/UserMappingBooks.entity';
import { fetchBookListBySearchKeyword } from '../utilities/axios.utils';
import { addBookInfo } from '../utilities/es.utils';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(UserMappingBooks)
    private readonly userMappingBooksRepository: Repository<UserMappingBooks>,
  ) {}

  private readonly logger = new Logger(BookService.name);
  async fetchBookListBySearchKeyword(searchKeyword: string) {
    try {
      const data = await fetchBookListBySearchKeyword(searchKeyword);
      return {
        total: data.total,
        result: data.result.map((element) => {
          return {
            id: element.id,
            titleInfo: element.titleInfo.replace(/<[^>]*>?/gm, ''), //html 태그 제거
            authorInfo: element.authorInfo,
            pubInfo: element.pubInfo,
            regDate: element.regDate,
            isbn: element.isbn === '' ? null : element.isbn,
            kdcCode1s: Number(element.kdcCode1s),
            kdcName1s: element.kdcName1s,
          };
        }),
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async addBookReview(request: BookRequest, userUid: number): Promise<any> {
    try {
      await this.userMappingBooksRepository.save({
        bookId: request.book.id,
        bookName: request.book.titleInfo,
        review: request.review.review,
        rate: request.review.rate,
        emotion: request.review.emotion,
        user: new User(userUid),
      });
      return await addBookInfo(request);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async deleteBookReview(
    userMappingBooksUid: number,
    userUid: number,
  ): Promise<void> {
    try {
      await this.userMappingBooksRepository.delete({
        userMappingBooksId: userMappingBooksUid,
        user: Equal(userUid),
      });

      //TODO
      //ES에서도 삭제할 것
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
