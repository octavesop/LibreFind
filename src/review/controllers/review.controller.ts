import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Review - 책 리뷰')
@Controller('/review')
export class ReviewController {}
