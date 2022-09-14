import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'USER' })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_uid' })
  userUid: number;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  // TODO :: response에는 안 들어오게 할 것
  @Column({ select: false, name: 'user_pw' })
  @Exclude()
  userPw: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'user_nickname', default: null })
  userNickname: string;

  @Column({ name: 'user_email', unique: true })
  userEmail: string;

  @Column({ name: 'agree_essential_term', default: false })
  agreeEssentialTerm: boolean;

  @Column({ name: 'agree_marketing_term', default: false })
  agreeMarketingSend: boolean;

  @Column({ name: 'is_activate', default: true })
  isActivate: boolean;

  @CreateDateColumn({ name: 'last_logined', default: null })
  lastLogined: Date;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;
}
