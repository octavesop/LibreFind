import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddGenreRequest {
  @ApiProperty()
  @IsString()
  readonly name: string;
}
