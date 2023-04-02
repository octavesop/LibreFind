import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from '../friend/entities/friend.entity';
import { S3ImageUploadHelper } from '../loaders/s3ImageUploader.helper';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  controllers: [UserController],
  providers: [UserService, S3ImageUploadHelper],
  exports: [UserService],
})
export class UserModule {}
