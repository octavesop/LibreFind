import {
  Body,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../../user/entities/user.entity';
import { bcryptHash, isHashMatch } from '../utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('RedisProviders')
    private readonly redisProvider,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async signUp(request: SignUpRequest): Promise<User> {
    try {
      request.userPw = await bcryptHash(request.userPw);
      return await this.userRepository.save(request);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async findUserByUserUid(userUid: number): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: {
          userUid: userUid,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error();
    }
  }

  async signIn(request: SignInRequest): Promise<User> {
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          userId: request.userId,
        },
      });
      if (!userInfo) {
        throw new Error('존재하지 않는 사용자입니다.');
      }
      if (!(await isHashMatch(request.userPw, userInfo.userPw))) {
        (await this.redisProvider.get('userId'))
          ? await this.redisProvider.incr('userId')
          : await this.redisProvider.set('userId', 1);
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      if ((await this.redisProvider.get('userId')) > 5) {
        throw new Error('로그인이 불가능합니다.');
      }
      await this.redisProvider.del('userId');
      return userInfo;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
