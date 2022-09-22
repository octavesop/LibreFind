import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'USER_MAPPING_BOOKS' })
export class UserMappingBooks {
  @PrimaryGeneratedColumn({ name: 'user_mapping_books_id' })
  userMappingBooksId: number;

  @Column({ name: 'book_id' })
  bookId: string;

  @Column({ name: 'book_name' })
  bookName: string;

  @Column({ name: 'review' })
  review: string;

  @Column({ name: 'rate' })
  rate: number;

  @Column('int', { name: 'emotion', array: true })
  emotion: number[];

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userMappingBooks)
  @JoinColumn({ name: 'user_uid' })
  user: User;
}
