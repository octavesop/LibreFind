import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistEmotionException } from 'src/exceptions/alreadyExistEmotion.exception';
import { InvalidEmotionException } from 'src/exceptions/invalidEmotion.exception';
import { NotExistUserException } from 'src/exceptions/notExistUser.exception';
import { AddGenreRequest } from 'src/genre/dtos/addGenreRequest.dto';
import { User } from 'src/user/entities/user.entity';
import { Equal, In, Repository } from 'typeorm';
import { AddPreferEmotionRequest } from '../dtos/addPreferGenreRequest.dto';
import { Emotion } from '../entities/emotion.entity';
import { UserMappingEmotion } from '../entities/userMappingEmotion.entity';

export class EmotionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
    @InjectRepository(UserMappingEmotion)
    private readonly userMappingEmotionRepository: Repository<UserMappingEmotion>,
  ) {}

  private readonly logger = new Logger(EmotionService.name);

  async fetchEmotionList(): Promise<Emotion[]> {
    try {
      return await this.emotionRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addEmotion(request: AddGenreRequest): Promise<Emotion> {
    try {
      const isExist = await this.emotionRepository.findOne({
        where: [
          {
            emotionName: Equal(request.name),
          },
          { emotionName: Equal(request.name.replace(' ', '')) }, //공백 제거 함께 검사
        ],
      });
      if (isExist) {
        throw new AlreadyExistEmotionException(
          request.name,
          isExist.emotionName,
        );
      }
      return await this.emotionRepository.save({ emotionName: request.name });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchUserEmotionList(userUid: number): Promise<UserMappingEmotion[]> {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: {
          userUid: userUid,
        },
      });
      if (!isUserExist) {
        throw new NotExistUserException();
      }
      return await this.userMappingEmotionRepository.find({
        where: {
          user: Equal(userUid),
        },
        relations: ['emotion'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCurrentUserPreference(
    userUid: number,
    request: AddPreferEmotionRequest,
  ): Promise<void> {
    try {
      const requestEmotionUidCount = await this.emotionRepository.count({
        where: {
          emotionUid: In(request.emotionUidList),
        },
      });
      if (requestEmotionUidCount !== request.emotionUidList.length) {
        throw new InvalidEmotionException();
      }

      const previousEmotionUidList = (
        await this.fetchUserEmotionList(userUid)
      ).map((v) => v.emotion.emotionUid);

      // 이전 장르 내역과의 차집합을 구함 => 이후 삭제
      const deleteEmotionList = previousEmotionUidList.filter(
        (emotionUid) => !request.emotionUidList.includes(emotionUid),
      );

      // 새 장르 내역과의 차집합을 구함 => 이후 추가
      const insertEmotionList = request.emotionUidList.filter(
        (emotionUid) => !previousEmotionUidList.includes(emotionUid),
      );

      if (deleteEmotionList.length > 0) {
        await this.userMappingEmotionRepository.delete(deleteEmotionList);
      }

      if (insertEmotionList.length > 0) {
        await this.userMappingEmotionRepository.save(
          insertEmotionList.map((emotionUid) => {
            return new UserMappingEmotion(userUid, emotionUid);
          }),
        );
      }
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
