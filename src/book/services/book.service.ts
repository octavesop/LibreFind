import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosError } from 'axios';
import { Equal, Repository } from 'typeorm';
import { BookEsRawResponse } from '../dto/bookEsRawResponse.dto';
import { FetchBookListResponse } from '../dto/fetchBookListResponse.dto';
import { UserMappingBooks } from '../entities/UserMappingBooks.entity';
import { fetchBookListBySearchKeyword } from '../utilities/axios';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(UserMappingBooks)
    private readonly userMappingBooksRepository: Repository<UserMappingBooks>,
  ) {}

  private readonly logger = new Logger(BookService.name);
  async fetchBookListBySearchKeyword(
    searchKeyword: string,
  ): Promise<FetchBookListResponse> {
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
      await Promise.all(
        result.result.map(async (v) => {
          await this.#addBookOnEs(v);
        }),
      );
      return await this.esSearchByIsbn(result.result.map((v) => v.isbn));
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async esSearchByIsbn(isbn: string[]): Promise<FetchBookListResponse> {
    try {
      const rawResult: BookEsRawResponse = (
        await axios.post(`${process.env.ES_URL}/_search`, {
          query: {
            bool: {
              must: [
                {
                  terms: {
                    isbn: isbn,
                  },
                },
              ],
            },
          },
        })
      ).data;
      const result = rawResult.hits.hits.map((v) => {
        return {
          _id: v._id,
          title: v._source.title,
          author: v._source.author,
          publisher: v._source.publisher,
          imageUrl: v._source.imageUrl,
          isbn: v._source.isbn,
          reviewed: v._source.reviewed,
        };
      });
      return {
        total: result.length,
        result: result,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
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
              await axios.put(`${process.env.ES_URL}/_doc/${request.id}`, {
                ...request,
                genre: [],
                emotion: [],
                rate: 0,
              });
              this.logger.verbose(
                `${request.title}(isbn: ${request.isbn})은 존재하지 않는 데이터이므로 추가되었습니다.`,
              );
            }
          }
        });
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
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
