import { Emotion } from 'src/emotion/entities/emotion.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Agree } from './agree.entity';

@Entity('REVIEW')
@Unique(['user', 'bookUid'])
export class Review {
  constructor(reviewUid: number) {
    this.reviewUid = reviewUid;
  }
  @PrimaryGeneratedColumn({ name: 'review_uid' })
  reviewUid: number;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'content', nullable: false })
  content: string;

  @Column({ name: 'book_uid', nullable: false })
  bookUid: string;

  @Column({ name: 'rate', default: 3 })
  rate: number;

  @ManyToOne(() => Emotion, (emotion) => emotion.review)
  @JoinColumn({ name: 'emotion_uid' })
  emotion: Emotion;

  @ManyToOne(() => Genre, (genre) => genre.review)
  @JoinColumn({ name: 'genre_uid' })
  genre: Genre;

  @ManyToOne(() => User, (user) => user.userPreferGenre)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @OneToMany(() => Agree, (like) => like.review, { cascade: true })
  @JoinColumn({ name: 'like_uid' })
  agree: Agree[];

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt: Date;
}
