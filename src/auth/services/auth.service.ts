import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginTriedOverFlowException } from '../../exceptions/loginTriedOverflow.exception';
import { NotExistUserException } from '../../exceptions/notExistUser.exception';
import { PasswordNotMatchException } from '../../exceptions/passwordNotMatch.exception';
import { User } from '../../user/entities/user.entity';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
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
        throw new NotExistUserException();
      }
      const key = `user:${request.userId}`;
      const failedToLogin = await this.redisProvider.get(key);

      if (failedToLogin > 5) {
        throw new LoginTriedOverFlowException();
      }

      if (!(await isHashMatch(request.userPw, userInfo.userPw))) {
        if (failedToLogin) {
          await this.redisProvider.incr(key);
          await this.redisProvider.expire(
            key,
            60 * 60 * 24, // 24시간. 다시 갱신
          );
        } else {
          await this.redisProvider.set(key, 1, 'EX', 60 * 60 * 24); // 24시간
        }
        throw new PasswordNotMatchException(
          isNaN(failedToLogin) ? 1 : failedToLogin,
        );
      }

      await this.redisProvider.del('userId');
      return userInfo;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotExistUserException) {
        throw error;
      }
      if (error instanceof PasswordNotMatchException) {
        throw error;
      }
      if (error instanceof LoginTriedOverFlowException) {
        throw error;
      }
    }
  }
}
