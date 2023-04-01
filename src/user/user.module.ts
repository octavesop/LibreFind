import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { Friend } from './entities/friend.entity';
import { User } from './entities/user.entity';
import { S3ImageUploadHelper } from './helper/s3ImageUploader.helper';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  controllers: [UserController],
  providers: [UserService, S3ImageUploadHelper],
  exports: [UserService],
})
export class UserModule {}
