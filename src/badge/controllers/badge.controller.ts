import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Badge } from '../schemas/badge.schema';
import { BadgeService } from '../services/badge.service';

@ApiTags('Badge - 배지')
@Controller('/badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get('/')
  async fetchBadgeList(): Promise<Badge[]> {
    return await this.badgeService.fetchAllBadgeList();
  }

  @Get('/me')
  async fetchBadgeListById(): Promise<Badge[]> {
    return await this.badgeService.fetchBadgeListById(1);
  }
}
