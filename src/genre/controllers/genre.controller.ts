import { Controller } from '@nestjs/common';
import { GenreService } from '../services/genre.service';

@Controller('/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}
}
