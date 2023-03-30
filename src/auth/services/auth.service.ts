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

      const failedCount = await this.#fetchFailedLoginCount(request.userId);

      if (failedCount > 5) {
        throw new LoginTriedOverFlowException();
      }

      if (!(await isHashMatch(request.userPw, userInfo.userPw))) {
        await this.#increaseFailedLoginCount(request.userId);
        throw new PasswordNotMatchException(failedCount);
      }

      await this.redisProvider.del('userId');
      return userInfo;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async #fetchFailedLoginCount(userId: string): Promise<number> {
    const key = `user:${userId}`;
    const failedToLogin = await this.redisProvider.get(key);
    if (!failedToLogin) {
      await this.redisProvider.set(key, 0, 'EX', 60 * 60 * 24); // 24시간
    }
    return failedToLogin ?? 0;
  }

  async #increaseFailedLoginCount(userId: string): Promise<void> {
    const key = `user:${userId}`;
    await this.redisProvider.incr(key);
    await this.redisProvider.expire(
      key,
      60 * 60 * 24, // 24시간. 다시 갱신
    );
    return;
  }
}
