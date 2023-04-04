import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EmotionController } from './controllers/emotion.controller';
import { Emotion } from './entities/emotion.entity';
import { UserMappingEmotion } from './entities/userMappingEmotion.entity';
import { EmotionService } from './services/emotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion, UserMappingEmotion, User])],
  controllers: [EmotionController],
  providers: [EmotionService],
  exports: [EmotionService],
})
export class EmotionModule {}
