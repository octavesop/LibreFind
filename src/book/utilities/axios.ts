import { Logger } from '@nestjs/common';
import axios from 'axios';
import { BookRawResponse } from '../dto/bookRawResponse.dto';

export const fetchBookListBySearchKeyword = async (
  searchKeyword: string,
): Promise<BookRawResponse> => {
  const logger = new Logger(fetchBookListBySearchKeyword.name);
  try {
    const { data } = await axios.get(process.env.BOOK_OPENAPI_URL, {
      params: {
        query: searchKeyword,
      },
      headers: {
        'X-Naver-Client-Id': process.env.BOOK_OPENAPI_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.BOOK_OPENAPI_CLIENT_SECRET,
      },
    });
    return data;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
