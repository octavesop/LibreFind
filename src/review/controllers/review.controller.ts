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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/auth/dto/payload.dto';
import { UserPayload } from 'src/decorators/userPayload.decorator';
import { AddReviewRequest } from '../dto/addReviewRequest.dto';
import { UpdateListRequest } from '../dto/updateLikeRequest.dto';
import { Agree } from '../entities/agree.entity';
import { Review } from '../entities/review.entity';
import { ReviewService } from '../services/review.service';

@ApiTags('Review - 책 리뷰')
@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @ApiOperation({
    description:
      '리뷰 목록을 가져옵니다. 정렬 기준이 없을 경우 좋아요 순으로 나열됩니다.',
  })
  @Get('/')
  async fetchReviewList(
    @Query('limit') limit: number,
    @Query('current') current: number,
    @Query('genreUid') genreUid?: number,
  ): Promise<Review[]> {
    return await this.reviewService.fetchReviewList(limit, current, genreUid);
  }

  @ApiOperation({ description: '내가 작성한 리뷰 목록을 확인합니다.' })
  @Get('/user/me')
  async fetchCurrentUserReviewList(
    @Query('limit') limit: number,
    @Query('current') current: number,
    @UserPayload() userInfo: Payload,
  ): Promise<Review[]> {
    return await this.reviewService.fetchUserReviewList(
      limit,
      current,
      userInfo.userUid,
    );
  }

  @ApiOperation({ description: '특정 사용자의 리뷰 목록을 확인합니다.' })
  @Get('/user/:userUid')
  async fetchUserReviewList(
    @Param('userUid') userUid: number,
    @Query('limit') limit: number,
    @Query('current') current: number,
  ): Promise<Review[]> {
    return await this.reviewService.fetchUserReviewList(
      limit,
      current,
      userUid,
    );
  }

  @ApiOperation({ description: '새 리뷰를 추가합니다.' })
  @Post('/')
  async addReview(
    @Body() request: AddReviewRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<Review> {
    return await this.reviewService.addReview(request, userInfo.userUid);
  }

  @ApiOperation({ description: '기존 리뷰를 수정합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:reviewUid')
  async updateReview(
    @Param('reviewUid') reviewUid: number,
    @Body() request: AddReviewRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    return await this.reviewService.updateReview(
      reviewUid,
      request,
      userInfo.userUid,
    );
  }

  @ApiOperation({ description: '리뷰를 삭제합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:reviewUid')
  async deleteReview(
    @Param('reviewUid') reviewUid: number,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    await this.reviewService.deleteReview(reviewUid, userInfo.userUid);
    return;
  }

  @ApiOperation({
    description: '특정 리뷰에 좋아요한 사용자 리스트를 가져옵니다.',
  })
  @Get('/like/:reviewUid')
  async fetchLikeOnReview(
    @Param('reviewUid') reviewUid: number,
  ): Promise<Agree[]> {
    return await this.reviewService.fetchLikeOnReview(reviewUid);
  }

  @ApiOperation({ description: '특정 리뷰에 좋아요를 추가/삭제합니다.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/like/:reviewUid')
  async addLikeOnReview(
    @Param('reviewUid') reviewUid: number,
    @Body() request: UpdateListRequest,
    @UserPayload() userInfo: Payload,
  ): Promise<void> {
    await this.reviewService.addLikeOnReview(
      reviewUid,
      request,
      userInfo.userUid,
    );
    return;
  }
}
