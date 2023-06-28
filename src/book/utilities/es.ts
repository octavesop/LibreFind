import { Logger } from '@nestjs/common';
import axios from 'axios';

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

export const updateEsBook = async (
  bookUid: string,
  review: { emotion: number; genre: number; rate: number },
) => {
  const logger = new Logger(updateEsBook.name);
  try {
    const foundBook: {
      id: string;
      title: string;
      author: string;
      publisher: string;
      imageUrl: string;
      isbn: string;
      review: {
        emotion: Record<string, number>;
        genre: Record<string, number>;
        rate: number;
        rateCount: number;
      };
    } = (await axios.get(process.env.ES_URL + '/_doc/' + bookUid)).data._source;

    console.log(
      JSON.stringify({
        ...foundBook,
        review: {
          emotion: {
            ...foundBook.review?.emotion,
            [review.emotion]:
              foundBook.review?.emotion[review.emotion] ?? 0 + 1,
          },
          genre: {
            ...foundBook.review?.genre,
            [review.genre]: foundBook.review?.genre[review.genre] ?? 0 + 1,
          },
          rate: foundBook.review?.rate ?? 0 + review.rate,
          rateCount: foundBook.review?.rateCount ?? 0 + 1,
        },
      }),
    );

    const { data } = await axios.put(process.env.ES_URL + '/_doc/' + bookUid, {
      ...foundBook,
      review: {
        emotion: {
          ...foundBook.review?.emotion,
          [review.emotion]: foundBook.review?.emotion[review.emotion] ?? 0 + 1,
        },
        genre: {
          ...foundBook.review?.genre,
          [review.genre]: foundBook.review?.genre[review.genre] ?? 0 + 1,
        },
        rate: foundBook.review?.rate ?? 0 + review.rate,
        rateCount: foundBook.review?.rateCount ?? 0 + 1,
      },
    });
    return data;
  } catch (error) {
    logger.error(error);
    throw error(error);
  }
};
