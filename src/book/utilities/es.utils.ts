import { Logger } from '@nestjs/common';
import axios from 'axios';

export const addBookInfo = async () => {
  const logger = new Logger(addBookInfo.name);
  try {
    const { data } = await axios.put(
      process.env.ES_URL + '/_doc' + '/247365887',
      {
        id: '247365887',
        titleInfo: '안녕, 나나',
        authorInfo: '나윤아 지음',
        pubInfo: '뜨인돌',
        regDate: '20150803',
        isbn: '9788958075776',
        kdcCode1s: 8,
        kdcName1s: '문학',
      },
    );
    return data;
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};
