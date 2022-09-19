import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class SignUpRequest {
  @ApiProperty()
  @IsString()
  readonly userId: string;

  @ApiProperty()
  @IsString()
  userPw: string;

  @ApiProperty()
  @IsString()
  readonly userName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly userNickname?: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly userEmail: string;

  @ApiProperty()
  @IsBoolean()
  readonly agreeEssentialTerm: boolean;

  @ApiProperty()
  @IsBoolean()
  readonly agreeMarketingSend: boolean;
}
