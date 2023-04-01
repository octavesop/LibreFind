import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPasswordRequest {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  readonly userPassword: string;
}
