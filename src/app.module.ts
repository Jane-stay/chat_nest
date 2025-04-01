import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigModule } from './config/db/config.module';
import { ConfigModule } from '@nestjs/config';
import { DbConfigService } from './config/db/config.service';
import { join } from 'path';
import { UserSubscriber } from './modules/users/subscribers/user.subscribe';
import { AppConfigModule } from './config/app/config.module';
import { AppDataSource } from './ormconfig';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (configService: DbConfigService) => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUser,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, './migrations/**/*{.ts,.js}')],
        synchronize: configService.nodeEnv === 'dev',
        subscribers: [UserSubscriber],
        ssl: false,
        logging: true,
        logger: 'advanced-console',
      }),
      inject: [DbConfigService],
    }),

    UsersModule,
    AuthModule,
    AppConfigModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot(AppDataSource.options),
//     ChatModule,
//     UsersModule,
//     AuthModule,
//     AppConfigModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
