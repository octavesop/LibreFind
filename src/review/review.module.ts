import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ReviewController } from './controllers/review.controller';
import { Agree } from './entities/agree.entity';
import { Review } from './entities/review.entity';
import { ReviewService } from './services/review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Agree])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
