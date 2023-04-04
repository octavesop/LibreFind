import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('REVIEW')
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_uid' })
  reviewUid: number;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;
}
