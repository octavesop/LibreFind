import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { Payload } from '../../auth/dto/payload.dto';
import { UserPayload } from '../../decorators/userPayload.decorator';
import { UpdateUserPasswordRequest } from '../dto/updateUserPasswordRequest.dto';
import { UpdateUserRequest } from '../dto/updateUserRequest.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: '사용할 아이디가 중복인지 검증합니다.' })
  @Get('/duplicate')
  async fetchUserDuplicated(
    @Query('userId') userId: string,
  ): Promise<{ result: boolean }> {
    return await this.userService.IsUserExist(userId);
  }

  @ApiOperation({ description: '사용자의 정보를 변경합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/')
  async updateUserInfo(
    @UserPayload() userInfo: Payload,
    @Body() request: UpdateUserRequest,
  ): Promise<void> {
    await this.userService.updateUserInfo(
      userInfo.userUid,
      userInfo.userId,
      request,
    );
    return;
  }

  @ApiOperation({
    description:
      '사용자의 비밀번호를 확인합니다. 해당 api는 중요 정보 접근 및 변경에 활용됩니다.',
  })
  @Post('/password')
  async checkUserPassword(
    @UserPayload() userInfo: Payload,
    @Body() request: UpdateUserPasswordRequest,
  ): Promise<{ check: boolean }> {
    return await this.userService.checkUserPassword(userInfo.userUid, request);
  }

  @ApiOperation({ description: '사용자의 비밀번호를 변경합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/password')
  async updateUserPassword(
    @UserPayload() userInfo: Payload,
    @Body() request: UpdateUserPasswordRequest,
  ): Promise<void> {
    await this.userService.updateUserPassword(userInfo.userUid, request);
    return;
  }

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
  @Get('/search')
  async fetchUser(
    @Query('limit') limit: number,
    @Query('current') current: number,
  ): Promise<User[]> {
    return await this.userService.fetchUser(limit, current);
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
