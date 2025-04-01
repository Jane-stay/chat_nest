import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('채팅')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '메시지 생성' })
  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.chatService.createMessage(createMessageDto);
  }
}
