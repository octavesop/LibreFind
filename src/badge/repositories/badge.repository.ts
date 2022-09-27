import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge } from '../schemas/badge.schema';

@Injectable()
export class BadgeRepository {
  constructor(
    @InjectModel(Badge.name)
    private readonly badgeModel: Model<Badge>,
  ) {}

  async findAll(): Promise<Badge[]> {
    return await this.badgeModel.find();
  }

  async findAllByUserUid(userUid: number): Promise<Badge[]> {
    return await this.badgeModel.find({ user: userUid });
  }
}
