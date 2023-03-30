import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { AlreadyExistFriendException } from '../../exceptions/alreadyExistFriend.exception';
import { CannotBeFriendWithMyselfException } from '../../exceptions/cannotBeFriendWithMyself.exception';
import { NotExistFriendException } from '../../exceptions/notExistFriend.exception';
import { NotExistUserException } from '../../exceptions/notExistUser.exception';
import { Friend } from '../entities/friend.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async fetchUser(limit: number, current: number): Promise<User[]> {
    try {
      const result = await this.userRepository.find({});
      return result.slice((current - 1) * limit, current * limit);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async fetchFriends(
    userUid: number,
    limit: number,
    current: number,
  ): Promise<User[]> {
    const friendEntityList = await this.friendRepository.findBy({
      userUid: Equal(userUid),
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
            userUid: Equal(userUid),
            userFriendUid: friendUser.userUid,
            relation: 'friend',
          },
        ],
      });
      if (isFriendExist.length > 0) {
        throw new AlreadyExistFriendException();
      }
      await this.friendRepository.save([
        new Friend(userUid, userFriendUid, 'friend'),
        new Friend(userFriendUid, userUid, 'friend'),
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
            userUid: Equal(userUid),
            userFriendUid: Equal(userFriendUid),
            relation: 'friend',
          },
          {
            userUid: Equal(userFriendUid),
            userFriendUid: Equal(userUid),
            relation: 'friend',
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
