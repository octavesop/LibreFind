import { ApiProperty } from '@nestjs/swagger';

// TODO
// class-validator 달기
export class SignUpRequest {
  @ApiProperty()
  readonly userId: string;
  @ApiProperty()
  userPw: string;
  @ApiProperty()
  readonly userName: string;
  @ApiProperty({ required: false })
  readonly userNickname?: string;
  @ApiProperty()
  readonly userEmail: string;
  @ApiProperty()
  readonly agreeEssentialTerm: boolean;
  @ApiProperty()
  readonly agreeMarketingSend: boolean;
}
