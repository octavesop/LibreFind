import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateListRequest {
  @ApiProperty()
  @IsBoolean()
  readonly like: boolean;
}
