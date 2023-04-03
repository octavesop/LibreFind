import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { GenreController } from './controllers/genre.controller';
import { Genre } from './entities/genre.entity';
import { UserMappingGenre } from './entities/userMappingGenre.entity';
import { GenreService } from './services/genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre, UserMappingGenre, User])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
