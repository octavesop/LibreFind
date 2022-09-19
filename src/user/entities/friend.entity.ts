import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'FRIEND' })
@Unique(['userUid', 'userFriendUid', 'relation'])
export class Friend {
  @PrimaryGeneratedColumn({ name: 'friend_uid' })
  friendUid: number;

  @Column({ name: 'user_uid' })
  userUid: number;

  @Column({ name: 'user_friend_uid' })
  userFriendUid: number;

  @Column({ name: 'relation', default: 'friend' })
  relation: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
