import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistFriendException } from 'src/exceptions/alreadyExistFriend.exception';
import { CannotBeFriendWithMyselfException } from 'src/exceptions/cannotBeFriendWithMyself.exception';
import { Friend } from 'src/friend/entities/friend.entity';
import { User } from 'src/user/entities/user.entity';
import { Equal, In, Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(FriendService.name);
  async fetchFriends(
    userUid: number,
    limit: number,
    current: number,
  ): Promise<User[]> {
    try {
      const friendList = await this.friendRepository.find({
        where: [
          {
            user: Equal(userUid),
          },
          {
            friendUid: Equal(userUid),
          },
        ],
        relations: ['user'],
      });

      const friendUserUidList = [
        ...friendList.map((v) => v.user.userUid),
        ...friendList.map((v) => v.friendUid),
      ].filter((v) => v !== userUid);

      const result = await this.userRepository.find({
        where: {
          userUid: In(friendUserUidList),
        },
      });
      return result.slice((current - 1) * limit, current * limit);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addFriend(userUid: number, userFriendUid: number) {
    try {
      if (userUid == userFriendUid) {
        throw new CannotBeFriendWithMyselfException();
      }

      const isExist = await this.friendRepository.find({
        where: [
          {
            friendUid: Equal(userFriendUid),
            user: Equal(userUid),
          },
          {
            friendUid: Equal(userUid),
            user: Equal(userFriendUid),
          },
        ],
      });

      if (isExist.length > 0) {
        throw new AlreadyExistFriendException();
      }

      return await this.friendRepository.save({
        user: new User(userUid > userFriendUid ? userUid : userFriendUid), // 중복을 막기 위해 반드시 user에 더 큰 수가 들어간다.
        userFriendUid: userUid < userFriendUid ? userUid : userFriendUid, // 반드시 friend에 더 작은 수가 들어간다.
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteFriend(userUid: number, userFriendUid: number) {
    try {
      const deleteList = await this.friendRepository.findOne({
        where: {
          user: Equal(userUid > userFriendUid ? userUid : userFriendUid), // 중복을 막기 위해 반드시 user에 더 큰 수가 들어간다.
          userFriendUid: Equal(
            userUid < userFriendUid ? userUid : userFriendUid,
          ), // 반드시 friend에 더 작은 수가 들어간다.
        },
      });
      await this.friendRepository.delete(deleteList.friendUid);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
