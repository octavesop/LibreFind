import { Logger } from '@nestjs/common';
import axios from 'axios';

export const fetchBookListBySearchKeyword = async (
  searchKeyword: string,
): Promise<any> => {
  const logger = new Logger(fetchBookListBySearchKeyword.name);
  try {
    const { data } = await axios.get(process.env.NL_URL, {
      params: {
        key: process.env.NL_AUTH_KEY,
        kwd: searchKeyword,
        apiType: 'json',
      },
    });
    return data;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
