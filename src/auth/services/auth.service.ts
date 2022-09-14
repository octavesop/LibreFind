import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInRequest } from '../dto/signInRequest.dto';
import { SignUpRequest } from '../dto/signUpRequest.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(AuthService.name);
  async signUp(request: SignUpRequest): Promise<User> {
    try {
      // TODO :: hash값으로 변형할 것
      request.hashedPw = 'test';
      return await this.userRepository.save(request);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async signIn(request: SignInRequest): Promise<User | HttpException> {
    try {
      const userInfo = await this.userRepository.findOne({
        where: {
          userId: request.userId,
          userPw: request.userPw,
        },
      });
      if (!userInfo) {
        throw new Error('존재하지 않는 사용자입니다.');
      }
      return userInfo;
    } catch (error) {
      if (error.message === '존재하지 않는 사용자입니다.') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      this.logger.error(error);
    }
  }
}
