export class ElasticReviewResponse {
  readonly reviewUid: number;

  readonly genreUid: number;
  readonly emotionUid: number;

  readonly userUid: number;
  readonly userId: string;
  readonly userNickname: string;

  readonly bookUid: number;
  readonly bookName: string;

  readonly title: string;
  readonly content: string;

  readonly likeCount: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}
