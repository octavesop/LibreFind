import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailSignRequest {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
