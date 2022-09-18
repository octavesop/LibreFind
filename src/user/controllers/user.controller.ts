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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Payload } from '../../auth/dto/payload.dto';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard.guard';
import { UserPayload } from '../../decorators/userPayload.decorator';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: '모든 사용자 가져오기' })
  @ApiQuery({
    name: 'limit',
    description: '하나의 페이지에 보여줄 사용자의 수',
  })
  @ApiQuery({
    name: 'current',
    description: '현재 페이지(이 값은 limit에 의존적)',
  })
  @Get('/')
  async fetchUser(
    @Query('limit') limit: number,
    @Query('current') current: number,
  ): Promise<User[]> {
    return await this.userService.fetchUser(limit, current);
  }

  @Get('/friend')
  async fetchFriends(
    @UserPayload() userInfo: Payload,
    @Query('limit') limit: number,
    @Query('current') current: number,
  ): Promise<User[]> {
    return await this.userService.fetchFriends(
      userInfo.userUid,
      limit,
      current,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/friend/:userFriendUid')
  async addFriend(
    @UserPayload() userInfo: Payload,
    @Param('userFriendUid') userFriendUid: number,
  ): Promise<void> {
    await this.userService.addFriend(userInfo.userUid, userFriendUid);
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/friend/:userFriendUid')
  async deleteFriend(
    @UserPayload() userInfo: Payload,
    @Param('userFriendUid') userFriendUid: number,
  ): Promise<void> {
    await this.userService.deleteFriend(userInfo.userUid, userFriendUid);
    return;
  }
}
