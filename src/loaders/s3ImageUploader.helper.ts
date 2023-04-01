import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import {
  ContentTypeGeneratorFromBase64Buffer,
  ImageUrlGenerator,
  s3ReportDirectoryGenerator,
} from './imageUpload';

@Injectable()
export class S3ImageUploadHelper {
  constructor(
    @Inject('S3Uploader')
    private readonly s3Uploader: S3,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(S3ImageUploadHelper.name);

  async uploadS3Image(image: string, userId: string): Promise<string> {
    try {
      const imageType = await ContentTypeGeneratorFromBase64Buffer(image);
      const imageDir = await s3ReportDirectoryGenerator(userId);
      await this.s3Uploader
        .putObject({
          Bucket: this.configService.get('AWS_IMAGE_BUCKET_NAME'),
          Key: imageDir,
          Body: Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
          ),
          ContentEncoding: 'base64',
          ContentType: imageType,
          ACL: 'public-read',
        })
        .promise();
      return process.env.AWS_DOMAIN + imageDir;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // 이미지 삭제
  async deleteS3Image(userId: string): Promise<void> {
    try {
      const imageDir = await s3ReportDirectoryGenerator(userId);
      await this.s3Uploader
        .deleteObject({
          Bucket: this.configService.get('AWS_IMAGE_BUCKET_NAME'),
          Key: imageDir,
        })
        .promise();
      return;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // S3 파일 있는지 조회
  async getS3Image(userId: string): Promise<string> {
    try {
      const imageDir = await s3ReportDirectoryGenerator(userId);
      await this.s3Uploader
        .getObject({
          Bucket: this.configService.get('AWS_IMAGE_BUCKET_NAME'),
          Key: imageDir,
        })
        .promise();
      return await ImageUrlGenerator(imageDir);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
