import { Logger } from '@nestjs/common';
import axios from 'axios';
import { BookRequest } from '../dto/bookRequest.dto';

export const fetchBookInfo = async () => {
  const logger = new Logger(fetchBookInfo.name);
  try {
    const { data } = await axios.post(process.env.ES_URL + '/_search', {
      query: {
        match_all: {},
      },
    });
    return data.hits.hits[0]._source;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
export const addBookInfo = async (request: BookRequest) => {
  const logger = new Logger(addBookInfo.name);
  try {
    await axios.put(process.env.ES_URL + '/_doc' + '/247365887', request);
    return;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
