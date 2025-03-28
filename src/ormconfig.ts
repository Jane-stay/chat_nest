import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { DbConfigService } from './config/db/config.service';

import * as dotenv from 'dotenv';
import { UserSubscriber } from './modules/users/subscribers/user.subscribe';

dotenv.config();

const entity = join(__dirname, '/**/*.entity{.ts,.js}');
const migration = join(__dirname, './migrations/**/*{.ts,.js}');
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [entity],
  synchronize: false,
  migrations: [migration],
  logging: true,
  ssl: false,
  subscribers: [UserSubscriber],
});

// const entities = [join(__dirname, '/**/*.entity{.ts,.js}')];
// const migrations = [join(__dirname, './migrations/**/*{.ts,.js}')];

// const dbConfigService = new DbConfigService(new ConfigService());

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: dbConfigService.dbHost,
//   port: dbConfigService.dbPort,
//   username: dbConfigService.dbUser,
//   password: String(dbConfigService.dbPassword),
//   database: dbConfigService.dbName,
//   entities,
//   migrations,
//   synchronize: false,
//   logging: true,
//   subscribers: [UserSubscriber],
//   ssl: false,
// });
