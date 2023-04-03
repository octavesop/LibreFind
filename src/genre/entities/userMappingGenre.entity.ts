import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';

@Entity({ name: 'USER_MAPPING_GENRE' })
export class UserMappingGenre {
  constructor(genreUid: number, userUid: number) {
    this.genre = new Genre(genreUid);
    this.user = new User(userUid);
  }
  @PrimaryGeneratedColumn({ name: 'user_mapping_genre_uid' })
  userMappingGenreUid: number;

  @ManyToOne(() => Genre, (genre) => genre.userMappingGenre)
  @JoinColumn({ name: 'genre_uid' })
  genre: Genre;

  @ManyToOne(() => User, (user) => user.userMappingGenre)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;
}
