import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { fetchBookListBySearchKeyword } from '../utilities/axios.utils';
import { addBookInfo } from '../utilities/es.utils';

@Injectable()
export class BookService {
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

  async addBookReview(bookId: string): Promise<any> {
    return await addBookInfo();
  }
}