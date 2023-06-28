import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsNumber, Max, Min } from 'class-validator';

export class UpdateReviewRequest {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(3000)
  readonly content: string;

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(0)
  readonly rate: number;
}
