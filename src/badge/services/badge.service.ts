import { Injectable, Logger } from '@nestjs/common';
import { BadgeRepository } from '../repositories/badge.repository';
import { Badge } from '../schemas/badge.schema';

@Injectable()
export class BadgeService {
  constructor(private readonly badgeRepository: BadgeRepository) {}
  private readonly logger = new Logger(BadgeService.name);

  async fetchAllBadgeList(): Promise<Badge[]> {
    try {
      return await this.badgeRepository.findAll();
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async fetchBadgeListById(userUid: number): Promise<Badge[]> {
    try {
      return await this.badgeRepository.findAllByUserUid(userUid);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
