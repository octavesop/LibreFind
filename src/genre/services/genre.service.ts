import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistGenreException } from 'src/exceptions/alreadyExistGenre.exception';
import { InvalidGenreException } from 'src/exceptions/invalidGenre.exception';
import { NotExistUserException } from 'src/exceptions/notExistUser.exception';
import { User } from 'src/user/entities/user.entity';
import { Equal, In, Repository } from 'typeorm';
import { AddGenreRequest } from '../dtos/addGenreRequest.dto';
import { AddPreferGenreRequest } from '../dtos/addPreferGenreRequest.dto';
import { Genre } from '../entities/genre.entity';
import { UserMappingGenre } from '../entities/userMappingGenre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(UserMappingGenre)
    private readonly userMappingGenreRepository: Repository<UserMappingGenre>,
  ) {}
  private readonly logger = new Logger(GenreService.name);

  async fetchGenreList(): Promise<Genre[]> {
    try {
      return await this.genreRepository.find();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addGenre(request: AddGenreRequest): Promise<Genre> {
    try {
      const isExist = await this.genreRepository.findOne({
        where: [
          {
            genreName: Equal(request.name),
          },
          { genreName: Equal(request.name.replace(' ', '')) }, //공백 제거 함께 검사
        ],
      });
      if (isExist) {
        throw new AlreadyExistGenreException(request.name, isExist.genreName);
      }
      return await this.genreRepository.save({ genreName: request.name });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchUserPreferGenre(userUid: number): Promise<UserMappingGenre[]> {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: {
          userUid: userUid,
        },
      });
      if (!isUserExist) {
        throw new NotExistUserException();
      }
      return await this.userMappingGenreRepository.find({
        where: {
          user: Equal(userUid),
        },
        relations: ['genre'],
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCurrentUserPreferGenre(
    userUid: number,
    request: AddPreferGenreRequest,
  ): Promise<any> {
    try {
      const requestGenreUidCount = await this.genreRepository.count({
        where: {
          genreUid: In(request.genreUidList),
        },
      });
      if (requestGenreUidCount !== request.genreUidList.length) {
        throw new InvalidGenreException();
      }

      const previousGenreUidList = (
        await this.fetchUserPreferGenre(userUid)
      ).map((v) => v.genre.genreUid);

      // 이전 장르 내역과의 차집합을 구함 => 이후 삭제
      const deleteGenreList = previousGenreUidList.filter(
        (genreUid) => !request.genreUidList.includes(genreUid),
      );

      // 새 장르 내역과의 차집합을 구함 => 이후 추가
      const insertGenreList = request.genreUidList.filter(
        (genreUid) => !previousGenreUidList.includes(genreUid),
      );

      if (deleteGenreList.length > 0) {
        await this.userMappingGenreRepository.delete(deleteGenreList);
      }

      if (insertGenreList.length > 0) {
        await this.userMappingGenreRepository.save(
          insertGenreList.map((genreUid) => {
            return new UserMappingGenre(genreUid, userUid);
          }),
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
