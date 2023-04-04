import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Emotion } from './emotion.entity';

@Entity('USER_MAPPING_EMOTION')
export class UserMappingEmotion {
  constructor(userUid: number, emotionUid: number) {
    this.user = new User(userUid);
    this.emotion = new Emotion(emotionUid);
  }
  @PrimaryGeneratedColumn({ name: 'user_mapping_emotion_uid' })
  userMappingEmotionUid: number;

  @ManyToOne(() => User, (user) => user.userMappingEmotion)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @ManyToOne(() => Emotion, (emotion) => emotion.emotionUid)
  @JoinColumn({ name: 'emotion_uid' })
  emotion: Emotion;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;
}
