import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError } from 'axios';
import { Equal, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookRequest } from '../dto/bookRequest.dto';
import { UserMappingBooks } from '../entities/UserMappingBooks.entity';
import { fetchBookListBySearchKeyword } from '../utilities/axios';
import { addBookInfo, fetchBookInfo } from '../utilities/es';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(UserMappingBooks)
    private readonly userMappingBooksRepository: Repository<UserMappingBooks>,
  ) {}

  private readonly logger = new Logger(BookService.name);
  async fetchBookListBySearchKeyword(searchKeyword: string): Promise<any> {
    try {
      const data = await fetchBookListBySearchKeyword(searchKeyword);
      const result = {
        total: data.total,
        result: data.items.map((element) => {
          return {
            id: element.isbn,
            title: element.title,
            author: element.author,
            publisher: element.publisher,
            imageUrl: element.image ?? null,
            isbn: element.isbn,
          };
        }),
      };
      result.result.forEach(async (v) => {
        await this.#addBookOnEs(v);
      });
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async #addBookOnEs(request: {
    id: string;
    title: string;
    author: string;
    publisher: string;
    imageUrl: string;
    isbn: string;
  }): Promise<void> {
    try {
      await axios
        .get(`${process.env.ES_URL}/_doc/${request.id}`)
        .catch(async (error) => {
          if (error instanceof AxiosError) {
            if (error.response.status == 404) {
              this.logger.verbose(
                `${request.title}(isbn: ${request.isbn})은 존재하지 않는 데이터이므로 추가합니다.`,
              );
              await axios.put(`${process.env.ES_URL}/_doc/${request.id}`, {
                ...request,
                reviewed: 0,
              });
            }
          }
        });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchBestRank(): Promise<any> {
    try {
      return await fetchBookInfo();
    } catch (error) {
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
