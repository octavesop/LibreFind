import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddPreferGenreRequest {
  @ApiProperty()
  @IsArray()
  readonly genreUidList: number[];
}
