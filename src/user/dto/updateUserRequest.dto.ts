import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({ required: false })
  @IsBase64()
  @IsOptional()
  readonly userProfileImage?: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly userName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly userNickname: string;
}
