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

@Entity({ name: 'BADGE_MAPPING_USER' })
@Unique(['userUid', 'badgeUid'])
export class BadgeMappingUser {
  constructor() {}
  @PrimaryGeneratedColumn({ name: 'badge_mapping_user_uid' })
  badgeMappingUserUid: number;

  @Column({ name: 'badge_uid' })
  badgeUid: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userUid)
  @JoinColumn({ name: 'user_uid' })
  userUid: User;
}
