import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bcryptHash, isHashMatch } from 'src/auth/utils/hash.util';
import { Equal, In, Repository } from 'typeorm';
import { AlreadyExistFriendException } from '../../exceptions/alreadyExistFriend.exception';
import { CannotBeFriendWithMyselfException } from '../../exceptions/cannotBeFriendWithMyself.exception';
import { NotExistFriendException } from '../../exceptions/notExistFriend.exception';
import { NotExistUserException } from '../../exceptions/notExistUser.exception';
import { Friend } from '../../friend/entities/friend.entity';
import { S3ImageUploadHelper } from '../../loaders/s3ImageUploader.helper';
import { UpdateUserPasswordRequest } from '../dto/updateUserPasswordRequest.dto';
import { UpdateUserRequest } from '../dto/updateUserRequest.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly s3ImageUploadHelper: S3ImageUploadHelper,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async updateUserInfo(
    userUid: number,
    userId: string,
    request: UpdateUserRequest,
  ): Promise<void> {
    try {
      const userProfileImageDir = request.userProfileImage
        ? await this.s3ImageUploadHelper.uploadS3Image(
            request.userProfileImage,
            userId,
          )
        : null;
      const updateList = { ...request, userProfileImage: userProfileImageDir };
      await this.userRepository.update(userUid, updateList);
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async checkUserPassword(
    userUid: number,
    request: UpdateUserPasswordRequest,
  ): Promise<{ check: boolean }> {
    try {
      const { userPw } = await this.userRepository.findOne({
        where: {
          userUid: userUid,
        },
      });
      return { check: await isHashMatch(request.userPassword, userPw) };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateUserPassword(
    userUid: number,
    request: UpdateUserPasswordRequest,
  ) {
    try {
      await this.userRepository.update(userUid, {
        userPw: await bcryptHash(request.userPassword),
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchUser(limit: number, current: number): Promise<User[]> {
    try {
      const result = await this.userRepository.find({});
      return result.slice((current - 1) * limit, current * limit);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchFriends(
    userUid: number,
    limit: number,
    current: number,
  ): Promise<User[]> {
    const friendEntityList = await this.friendRepository.findBy({
      user: Equal(userUid),
    });
    const friendResult = await this.userRepository.find({
      where: {
        userUid: In(friendEntityList.map((entity) => entity.userFriendUid)),
      },
    });
    return friendResult.slice((current - 1) * limit, current * limit);
  }

  async addFriend(userUid: number, userFriendUid: number): Promise<void> {
    try {
      const friendUser = await this.userRepository.findOne({
        where: {
          userUid: Equal(userFriendUid),
        },
      });
      if (!friendUser) {
        throw new NotExistUserException();
      }
      if (friendUser.userUid === userUid) {
        throw new CannotBeFriendWithMyselfException();
      }

      const isFriendExist = await this.friendRepository.find({
        where: [
          {
            user: Equal(userUid),
            userFriendUid: friendUser.userUid,
          },
        ],
      });
      if (isFriendExist.length > 0) {
        throw new AlreadyExistFriendException();
      }
      await this.friendRepository.save([
        new Friend(userUid, userFriendUid),
        new Friend(userFriendUid, userUid),
      ]);
      return;
    } catch (error) {
      this.logger.error(error);

      if (error instanceof NotExistUserException) {
        throw error;
      }
      if (error instanceof CannotBeFriendWithMyselfException) {
        throw error;
      }
      if (error instanceof AlreadyExistFriendException) {
        throw error;
      }
    }
  }

  async deleteFriend(userUid: number, userFriendUid: number): Promise<void> {
    try {
      const friendEntity = await this.friendRepository.find({
        where: [
          {
            user: Equal(userUid),
            userFriendUid: Equal(userFriendUid),
          },
          {
            user: Equal(userFriendUid),
            userFriendUid: Equal(userUid),
          },
        ],
      });
      if (friendEntity.length < 1) {
        throw new NotExistFriendException();
      }
      await this.friendRepository.delete(
        friendEntity.map((entity) => entity.friendUid),
      );
      return;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotExistFriendException) {
        throw error;
      }
    }
  }

  async IsUserExist(userId: string): Promise<{ result: boolean }> {
    try {
      const result = await this.userRepository.count({
        where: {
          userId: userId,
        },
      });
      return {
        result: Boolean(result),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
