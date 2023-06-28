import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { UpdateReviewRequest } from './updateReviewRequest.dto';

export class AddReviewRequest extends UpdateReviewRequest {
  @ApiProperty()
  @IsString()
  readonly bookUid: string;

  @ApiProperty()
  @IsNumber()
  readonly genre: number;

  @ApiProperty()
  @IsNumber()
  readonly emotion: number;
}
