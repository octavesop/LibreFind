import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'FRIEND' })
@Unique(['userUid', 'userFriendUid', 'relation'])
export class Friend {
  constructor(userUid: number, userFriendUid: number, relation: string) {
    this.friendUid = 0;
    this.userUid = new User(userUid);
    this.userFriendUid = userFriendUid;
    this.relation = relation;
  }
  @PrimaryGeneratedColumn({ name: 'friend_uid' })
  friendUid: number;

  @Column({ name: 'relation', default: 'friend' })
  relation: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userUid)
  @JoinColumn({ name: 'user_uid' })
  userUid: User;

  @Column({ name: 'user_friend_uid' })
  userFriendUid: number;
}
