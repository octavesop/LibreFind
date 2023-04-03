import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'GENRE' })
export class Genre {
  constructor(genreUid: number) {
    this.genreUid = genreUid;
  }
  @PrimaryGeneratedColumn({ name: 'genre_uid' })
  genreUid: number;

  @Column({ name: 'genre_name', unique: true })
  genreName: string;
}
