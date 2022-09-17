import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'FRIEND' })
export class Friend {
  @PrimaryGeneratedColumn({ name: 'friend_uid' })
  friendUid: number;

  @Column({ name: 'user_uid', unique: true })
  userUid: number;

  @Column({ name: 'user_friend_uid', unique: true })
  userFriendUid: number;

  @Column({ name: 'relation', default: 'friend' })
  relation: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
