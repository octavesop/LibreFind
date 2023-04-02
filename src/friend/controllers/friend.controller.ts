import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Payload } from 'src/auth/dto/payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { UserPayload } from 'src/decorators/userPayload.decorator';
import { User } from 'src/user/entities/user.entity';
import { FriendService } from '../services/friend.service';

@Controller('/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/friend')
  async fetchFriends(
    @UserPayload() userInfo: Payload,
    @Query('limit') limit: number,
    @Query('current') current: number,
  ): Promise<User[]> {
    return await this.friendService.fetchFriends(
      userInfo.userUid,
      limit,
      current,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/friend/:userFriendUid')
  async addFriend(
    @UserPayload() userInfo: Payload,
    @Param('userFriendUid') userFriendUid: number,
  ): Promise<void> {
    await this.friendService.addFriend(userInfo.userUid, userFriendUid);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/friend/:userFriendUid')
  async deleteFriend(
    @UserPayload() userInfo: Payload,
    @Param('userFriendUid') userFriendUid: number,
  ): Promise<void> {
    await this.friendService.deleteFriend(userInfo.userUid, userFriendUid);
    return;
  }
}
