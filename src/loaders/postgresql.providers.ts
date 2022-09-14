import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const postgresqlProviders: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '0073',
  database: 'librefind',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};
