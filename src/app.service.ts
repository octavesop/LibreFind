import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  pong(): string {
    return 'pong';
  }
}
