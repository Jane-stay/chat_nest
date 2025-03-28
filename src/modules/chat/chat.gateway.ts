import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080)
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  private activeUsers = new Map<number, string>();

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (client.id === socketId) {
        this.activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
    console.log('disconnected!');
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.userId) {
      return { success: false, message: 'userId가 필요합니다.' };
    }

    if (!this.activeUsers.has(data.userId)) {
      this.activeUsers.set(data.userId, client.id);
      console.log(`User ${data.userId} registered with socket ${client.id}`);
      return { success: true, message: '등록 성공', userId: data.userId };
    } else {
      console.log('Already registered');
      return {
        success: false,
        message: '이미 등록된 사용자입니다',
        userId: data.userId,
      };
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody()
    data: {
      userId: number;
      receiveId: number;
      content: string;
      reply?: string;
    },
  ) {
    if (!this.activeUsers.has(data.userId)) {
      console.log('발신자가 등록되지 않은 유저입니다');
      return;
    }

    if (!this.activeUsers.has(data.receiveId)) {
      console.log('수신자가 등록되지 않은 유저입니다');
      return;
    }

    const receiverSocketId = this.activeUsers.get(data.receiveId);
    data.reply = '답장';
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', data);
      console.log(
        `메시지 전송 성공: ${data.userId} -> ${data.receiveId}: ${data.content}, ${data.reply}`,
      );
    }
  }

  @SubscribeMessage('receiveMessage')
  handleReceiveMEssage(
    @MessageBody() data: { userId: number; receiveId: number; content: string },
  ) {
    console.log(`Receive: ${data.content} from ${data.userId}`);
  }
}
