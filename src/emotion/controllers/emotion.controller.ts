import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/auth/dto/payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard.guard';
import { UserPayload } from 'src/decorators/userPayload.decorator';
import { AddGenreRequest } from 'src/genre/dtos/addGenreRequest.dto';
import { AddPreferEmotionRequest } from '../dtos/addPreferGenreRequest.dto';
import { Emotion } from '../entities/emotion.entity';
import { UserMappingEmotion } from '../entities/userMappingEmotion.entity';
import { EmotionService } from '../services/emotion.service';

@ApiTags('Emotion - 감정 분류')
@UseGuards(JwtAuthGuard)
@Controller('/emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @ApiOperation({ description: '전체 감정 분류를 가져옵니다.' })
  @Get('/')
  async fetchEmotionList(): Promise<Emotion[]> {
    return await this.emotionService.fetchEmotionList();
  }

  @ApiOperation({ description: '새로운 감정 분류를 추가합니다.' })
  @Post('/')
  async addEmotion(@Body() request: AddGenreRequest): Promise<Emotion> {
    return await this.emotionService.addEmotion(request);
  }

  @ApiOperation({ description: '현재 사용자의 선호 감정 분류를 가져옵니다.' })
  @Get('/user/me')
  async fetchCurrentUserEmotionList(
    @UserPayload() userInfo: Payload,
  ): Promise<UserMappingEmotion[]> {
    return await this.emotionService.fetchUserEmotionList(userInfo.userUid);
  }

  @ApiOperation({ description: '특정 사용자의 선호 감정 분류를 가져옵니다.' })
  @Get('/user/:userUid')
  async fetchUserEmotionList(
    @Param() userUid: number,
  ): Promise<UserMappingEmotion[]> {
    return await this.emotionService.fetchUserEmotionList(userUid);
  }

  @ApiOperation({ description: '현재 사용자의 선호 감정 분류를 변경합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/user/me')
  async updateCurrentUserPreference(
    @UserPayload() userInfo: Payload,
    @Body() request: AddPreferEmotionRequest,
  ): Promise<void> {
    await this.emotionService.updateCurrentUserPreference(
      userInfo.userUid,
      request,
    );
    return;
  }
}
