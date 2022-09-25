import { Logger } from '@nestjs/common';
import axios from 'axios';
import { BookRequest } from '../dto/bookRequest.dto';

export const addBookInfo = async (request: BookRequest) => {
  const logger = new Logger(addBookInfo.name);
  try {
    const { data } = await axios.put(
      process.env.ES_URL + '/_doc' + '/247365887',
      request,
    );
    return data;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
