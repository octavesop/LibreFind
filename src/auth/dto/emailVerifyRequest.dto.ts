import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EmailSignRequest } from './emailSignRequest.dto';

export class EmailVerifyRequest extends EmailSignRequest {
  @ApiProperty()
  @IsString()
  readonly code: string;
}
