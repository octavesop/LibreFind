import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMappingGenre } from './userMappingGenre.entity';

@Entity({ name: 'GENRE' })
export class Genre {
  constructor(genreUid: number) {
    this.genreUid = genreUid;
  }
  @PrimaryGeneratedColumn({ name: 'genre_uid' })
  genreUid: number;

  @Column({ name: 'genre_name', unique: true })
  genreName: string;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @OneToMany(
    () => UserMappingGenre,
    (userMappingGenre) => userMappingGenre.genre,
  )
  @JoinColumn({ name: 'user_mapping_genre_id' })
  userMappingGenre: UserMappingGenre[];
}
