import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddPreferEmotionRequest {
  @ApiProperty()
  @IsArray()
  readonly emotionUidList: number[];
}
