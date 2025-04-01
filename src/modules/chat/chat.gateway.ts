import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { LeaveChatRoomDto } from './dto/leave-chat-room.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@WebSocketGateway(8080)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`클라이언트 ${client.id}가 연결되었습니다.`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: JoinChatRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const chatRoom = await this.chatService.joinChatRoom(data);
      await client.join(chatRoom.id);
      client.emit(`joinedChatRoom`, { name: chatRoom.name, id: chatRoom.id });
    } catch (e) {
      client.emit(`error`, { message: (e as Error).message });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.createMessage(data);

      this.server.to(data.chatRoomId).emit('receiveMessage', message.content);
    } catch (e) {
      this.server
        .to(data.chatRoomId)
        .emit(`error`, { message: (e as Error).message });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody()
    data: LeaveChatRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const chatRoom = await this.chatService.leaveChatRoom(data);

      await client.leave(chatRoom.id);

      client.emit('leftRoom', {
        isActive: chatRoom.isActive,
        message: '채팅방에서 퇴장했습니다',
      });
      console.log(`${client.id}가 ${chatRoom.id}를 떠났습니다`);
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() data: EditMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message = await this.chatService.updateMessage(data);
      client.emit('updatedMessage', { message: message.content });
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMEssage(
    @MessageBody() data: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!data || !data.messageId) {
        throw new Error('삭제할 메시지ID를 확인해주세요.');
      }
      await this.chatService.deleteMessage(data.messageId, data.userId);
      this.server
        .to(data.chatRoomId)
        .emit('messageDeleted', { messageId: data.messageId });
    } catch (e) {
      client.emit('error', { message: (e as Error).message });
    }
  }
}
