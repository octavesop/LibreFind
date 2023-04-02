import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'FRIEND' })
@Unique(['user', 'userFriendUid'])
export class Friend {
  constructor(userUid: number, userFriendUid: number) {
    this.friendUid = 0;
    this.user = new User(userUid);
    this.userFriendUid = userFriendUid;
  }
  @PrimaryGeneratedColumn({ name: 'friend_uid' })
  friendUid: number;

  @Column({ name: 'user_friend_uid' })
  userFriendUid: number; // 항상 더 큰 uid가 이곳으로 들어온다.

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userUid)
  @JoinColumn({ name: 'user_uid' })
  user: User;
}
