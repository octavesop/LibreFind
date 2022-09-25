import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeController } from './controllers/badge.controller';
import { BadgeRepository } from './repositories/badge.repository';
import { Badge, BadgeSchema } from './schemas/badge.schema';
import { BadgeService } from './services/badge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    MongooseModule.forFeature([{ name: Badge.name, schema: BadgeSchema }]),
  ],
  controllers: [BadgeController],
  providers: [BadgeService, BadgeRepository],
  exports: [BadgeService],
})
export class BadgeModule {}
