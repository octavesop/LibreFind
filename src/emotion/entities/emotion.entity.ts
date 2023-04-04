import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMappingEmotion } from './userMappingEmotion.entity';

@Entity('EMOTION')
export class Emotion {
  constructor(emotionUid: number) {
    this.emotionUid = emotionUid;
  }
  @PrimaryGeneratedColumn({ name: 'emotion_uid' })
  emotionUid: number;

  @Column({ name: 'emotion_name', unique: true })
  emotionName: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @OneToMany(
    () => UserMappingEmotion,
    (userMappingEmotion) => userMappingEmotion.emotion,
  )
  @JoinColumn({ name: 'user_mapping_emotion_id' })
  userMappingEmotion: UserMappingEmotion[];
}
