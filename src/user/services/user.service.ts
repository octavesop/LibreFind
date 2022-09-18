import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    const friendEntityList = await this.friendRepository.find({
      where: {
        userUid: userUid,
      },
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
          userUid: userFriendUid,
        },
      });
      if (!friendUser) {
        throw new Error('존재하지 않는 사용자입니다.');
      }
      if (friendUser.userUid === userUid) {
        throw new Error('자기 자신은 친구 추가할 수 없습니다.');
      }

      const isFriendExist = await this.friendRepository.find({
        where: [
          {
            userUid: userUid,
            userFriendUid: friendUser.userUid,
            relation: 'friend',
          },
          {
            userUid: friendUser.userUid,
            userFriendUid: userUid,
            relation: 'friend',
          },
        ],
      });
      if (isFriendExist.length > 0) {
        throw new Error('이미 존재하는 친구입니다.');
      }
      await this.friendRepository.save({
        friendUid: 0,
        userUid: userUid,
        userFriendUid: friendUser.userUid,
        relation: 'friend',
      });
      await this.friendRepository.save({
        friendUid: 0,
        userUid: friendUser.userUid,
        userFriendUid: userUid,
        relation: 'friend',
      });
      return;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async deleteFriend(userUid: number, userFriendUid: number): Promise<void> {
    try {
      const friendEntity = await this.friendRepository.find({
        where: [
          {
            userUid: userUid,
            userFriendUid: userFriendUid,
            relation: 'friend',
          },
          {
            userUid: userFriendUid,
            userFriendUid: userUid,
            relation: 'friend',
          },
        ],
      });
      if (friendEntity.length < 1) {
        throw new Error('존재하지 않는 친구입니다.');
      }
      await this.friendRepository.delete(
        friendEntity.map((entity) => entity.friendUid),
      );
      return;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
