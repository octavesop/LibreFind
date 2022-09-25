import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class BookRequestBook {
  @IsString()
  @ApiProperty()
  readonly id: string;

  @IsString()
  @ApiProperty()
  readonly titleInfo: string;

  @IsString()
  @ApiProperty()
  readonly authorInfo: string;

  @IsString()
  @ApiProperty()
  readonly pubInfo: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly isbn?: string;

  @IsString()
  @ApiProperty()
  readonly kdcCode1s: string;

  @IsString()
  @ApiProperty()
  readonly kdcName1s: string;
}

export class BookRequestReview {
  @IsNumber()
  @ApiProperty()
  readonly rate: number;

  @IsString()
  @ApiProperty()
  readonly review: string;

  @IsArray()
  @ApiProperty()
  readonly emotion: string[];
}

export class BookRequest {
  @ApiProperty()
  @IsNotEmpty()
  book: BookRequestBook;

  @ApiProperty()
  @IsNotEmpty()
  review: BookRequestReview;
}
