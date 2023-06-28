import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { updateEsBook } from 'src/book/utilities/es';
import { Emotion } from 'src/emotion/entities/emotion.entity';
import { AlreadyExistReviewException } from 'src/exceptions/alreadyExistReview.exception';
import { CannotAgreeMyReviewException } from 'src/exceptions/cannotAgreeMyReview.exception';
import { NotExistReviewException } from 'src/exceptions/notExistReview.exception';
import { Genre } from 'src/genre/entities/genre.entity';
import { User } from 'src/user/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { AddReviewRequest } from '../dto/addReviewRequest.dto';
import { UpdateListRequest } from '../dto/updateLikeRequest.dto';
import { UpdateReviewRequest } from '../dto/updateReviewRequest.dto';
import { Agree } from '../entities/agree.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Agree)
    private readonly agreeRepository: Repository<Agree>,
  ) {}

  private readonly logger = new Logger(ReviewService.name);

  async fetchReviewList(
    limit: number,
    current: number,
    genreUid: number,
  ): Promise<Review[]> {
    try {
      const result = await this.reviewRepository.find({
        where: {
          genre: Equal(genreUid),
        },
      });
      return result.slice((current - 1) * limit, current * limit);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchUserReviewList(
    limit: number,
    current: number,
    userUid: number,
  ): Promise<Review[]> {
    limit;
    current;
    userUid;
    try {
      const result = await this.reviewRepository.find({
        where: {
          user: Equal(userUid),
        },
      });
      return result.slice((current - 1) * limit, current * limit);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async addLikeOnReview(
    reviewUid: number,
    request: UpdateListRequest,
    userUid: number,
  ): Promise<void> {
    try {
      if (request.like) {
        const reviewEntity = await this.reviewRepository.findOne({
          where: {
            reviewUid,
          },
          relations: ['user'],
        });
        if (!reviewEntity) {
          throw new NotExistReviewException();
        }
        if (reviewEntity.user.userUid === userUid) {
          throw new CannotAgreeMyReviewException();
        }
        await this.agreeRepository.save({
          agreeUid: 0,
          review: new Review(reviewUid),
          user: new User(userUid),
        });
      } else {
        const deleteAgreeEntity = await this.agreeRepository.findOne({
          where: {
            review: Equal(reviewUid),
            user: Equal(userUid),
          },
        });
        await this.agreeRepository.delete(deleteAgreeEntity.agreeUid);
      }

      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async fetchLikeOnReview(reviewUid: number): Promise<Agree[]> {
    try {
      return await this.agreeRepository.find({
        where: { review: Equal(reviewUid) },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async #isBookHasReviewed(bookUid: string, userUid: number): Promise<Review> {
    return await this.reviewRepository.findOne({
      where: {
        bookUid: bookUid,
        user: Equal(userUid),
      },
    });
  }

  async #isReviewExist(reviewUid: number, userUid: number): Promise<Review> {
    return await this.reviewRepository.findOne({
      where: {
        reviewUid: reviewUid,
        user: Equal(userUid),
      },
    });
  }

  async addReview(request: AddReviewRequest, userUid: number): Promise<Review> {
    try {
      if (await this.#isBookHasReviewed(request.bookUid, userUid)) {
        throw new AlreadyExistReviewException();
      }

      await updateEsBook(request.bookUid, {
        emotion: request.emotion,
        genre: request.genre,
        rate: request.rate,
      });

      return await this.reviewRepository.save({
        user: new User(userUid),
        bookUid: request.bookUid,
        title: request.title,
        content: request.content,
        emotion: new Emotion(request.emotion),
        genre: new Genre(request.genre),
        rate: request.rate,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateReview(
    reviewUid: number,
    request: UpdateReviewRequest,
    userUid: number,
  ): Promise<any> {
    try {
      const foundReview = await this.#isReviewExist(reviewUid, userUid);
      if (!foundReview) {
        throw new NotExistReviewException();
      }
      return await this.reviewRepository.update(foundReview.reviewUid, request);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteReview(reviewUid: number, userUid: number): Promise<any> {
    try {
      const foundReview = await this.#isReviewExist(reviewUid, userUid);
      if (!foundReview) {
        throw new NotExistReviewException();
      }
      await this.reviewRepository.delete(foundReview.reviewUid);
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
