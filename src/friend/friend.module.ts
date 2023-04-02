import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/friend/entities/friend.entity';
import { User } from 'src/user/entities/user.entity';
import { FriendController } from './controllers/friend.controller';
import { FriendService } from './services/friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
