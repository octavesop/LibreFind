import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './review.entity';

@Entity('AGREE')
export class Agree {
  @PrimaryGeneratedColumn({ name: 'agree_uid' })
  agreeUid: number;

  @ManyToOne(() => User, (user) => user.agree)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @ManyToOne(() => Review, (review) => review.agree, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_uid' })
  review: Review;
}
