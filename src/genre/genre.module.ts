import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreController } from './controllers/genre.controller';
import { GenreService } from './services/genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
