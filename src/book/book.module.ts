import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './controllers/book.controller';
import { BookService } from './services/book.service';

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
