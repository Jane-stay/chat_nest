import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Message } from './entities/message.entity';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message]), UsersModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
