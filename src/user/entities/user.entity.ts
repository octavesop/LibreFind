import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BadgeMappingUser } from '../../badge/entities/badge.entity';
import { UserMappingBooks } from '../../book/entities/userMappingBooks.entity';
import { Friend } from './friend.entity';

@Entity({ name: 'USER' })
export class User {
  constructor(userUid: number) {
    this.userUid = userUid;
  }
  @PrimaryGeneratedColumn({ name: 'user_uid' })
  userUid: number;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'user_pw' })
  @Exclude()
  userPw: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'user_nickname', default: null })
  userNickname: string;

  @Column({ name: 'user_email', unique: true })
  userEmail: string;

  @Column({ name: 'user_profile_image', default: null })
  userProfileImage: string;

  @Column({ name: 'agree_essential_term', default: false })
  agreeEssentialTerm: boolean;

  @Column({ name: 'agree_marketing_term', default: false })
  agreeMarketingSend: boolean;

  @Column({ name: 'is_activate', default: true })
  isActivate: boolean;

  @CreateDateColumn({ name: 'last_logined', default: new Date() })
  lastLogined: Date;

  @CreateDateColumn({ name: 'last_password_changed', default: new Date() })
  lastPasswordChanged: Date;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', default: null })
  deletedAt: Date;

  @OneToMany(
    () => UserMappingBooks,
    (userMappingBooks) => userMappingBooks.user,
  )
  @JoinColumn({ name: 'user_mapping_books_id' })
  userMappingBooks: UserMappingBooks[];

  @OneToMany(() => Friend, (friend) => friend.userUid)
  @JoinColumn({ name: 'user_mapping_books_id' })
  friendUid: Friend[];

  @OneToMany(
    () => BadgeMappingUser,
    (BadgeMappingUser) => BadgeMappingUser.userUid,
  )
  @JoinColumn({ name: 'badge_mapping_user_uid' })
  badgeMappingUserUid: BadgeMappingUser[];
}
