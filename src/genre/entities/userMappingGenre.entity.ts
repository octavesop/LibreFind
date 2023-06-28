import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';

@Entity({ name: 'USER_PREFER_GENRE' })
export class UserPreferGenre {
  constructor(genreUid: number, userUid: number) {
    this.genre = new Genre(genreUid);
    this.user = new User(userUid);
  }
  @PrimaryGeneratedColumn({ name: 'user_prefer_genre_uid' })
  userPreferGenreUid: number;

  @ManyToOne(() => Genre, (genre) => genre.userMappingGenre)
  @JoinColumn({ name: 'genre_uid' })
  genre: Genre;

  @ManyToOne(() => User, (user) => user.userPreferGenre)
  @JoinColumn({ name: 'user_uid' })
  user: User;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;
}
