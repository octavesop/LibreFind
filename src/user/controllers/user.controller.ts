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
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { Payload } from '../../auth/dto/payload.dto';
import { UserPayload } from '../../decorators/userPayload.decorator';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ description: '사용할 아이디가 중복인지 검증합니다.' })
  @Get('/duplicate')
  async fetchUserDuplicated(
    @Query('userId') userId: string,
  ): Promise<{ result: boolean }> {
    return await this.userService.IsUserExist(userId);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/friend/:userFriendUid')
  async addFriend(
    @UserPayload() userInfo: Payload,
    @Param('userFriendUid') userFriendUid: number,
  ): Promise<void> {
    await this.userService.addFriend(userInfo.userUid, userFriendUid);
    return;
  }

  @UseGuards(JwtAuthGuard)
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
