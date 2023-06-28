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
import { AddGenreRequest } from '../dtos/addGenreRequest.dto';
import { AddPreferGenreRequest } from '../dtos/addPreferGenreRequest.dto';
import { Genre } from '../entities/genre.entity';
import { UserPreferGenre } from '../entities/userMappingGenre.entity';
import { GenreService } from '../services/genre.service';

@ApiTags('Genre - 장르')
@UseGuards(JwtAuthGuard)
@Controller('/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @ApiOperation({ description: '전체 장르 분류를 가져옵니다.' })
  @Get('/')
  async fetchGenreList(): Promise<Genre[]> {
    return await this.genreService.fetchGenreList();
  }

  @ApiOperation({ description: '새로운 장르를 추가합니다.' })
  @Post('/')
  async addGenre(@Body() request: AddGenreRequest): Promise<Genre> {
    return await this.genreService.addGenre(request);
  }

  @ApiOperation({ description: '현재 사용자가 선호하는 장르를 가져옵니다.' })
  @Get('/user/me')
  async fetchCurrentUserPreferGenre(
    @UserPayload() userInfo: Payload,
  ): Promise<UserPreferGenre[]> {
    return await this.genreService.fetchUserPreferGenre(userInfo.userUid);
  }

  @ApiOperation({ description: '특정 사용자가 선호하는 장르를 가져옵니다.' })
  @Get('/user/:userUid')
  async fetchUserPreferGenre(
    @Param('userUid') userUid: number,
  ): Promise<UserPreferGenre[]> {
    return await this.genreService.fetchUserPreferGenre(userUid);
  }

  @ApiOperation({ description: '현재 사용자가 선호하는 장르를 추가합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/user/me')
  async updateCurrentUserPreferGenre(
    @UserPayload() userInfo: Payload,
    @Body() request: AddPreferGenreRequest,
  ): Promise<void> {
    return await this.genreService.updateCurrentUserPreferGenre(
      userInfo.userUid,
      request,
    );
  }
}
