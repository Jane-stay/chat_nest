import { Injectable } from '@nestjs/common';

import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Message } from './entities/message.entity';
import { LeaveChatRoomDto } from './dto/leave-chat-room.dto';
import { EditMessageDto } from './dto/edit-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async findChatRoomById(id: string) {
    return await this.chatRoomRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
  }

  // async joinChatRoom(joinChatRoomDto: JoinChatRoomDto) {
  //   // 이렇게 여러 로직이 합쳐진 경우, 뒤의 로직이 실패하면 앞의 것도 록백하도록 트랜잭션 처리가 필요함
  //   // QueryRunner 사용하면 되는데,
  //   let chatRoom: ChatRoom | null;
  //   const user = await this.usersService.findUserById(
  //     joinChatRoomDto.participantId,
  //   );
  //   if (!user) {
  //     throw new Error('유저가 없습니다');
  //   }

  //   if (joinChatRoomDto.chatRoomId) {
  //     chatRoom = await this.findChatRoomById(joinChatRoomDto.chatRoomId);
  //     if (!chatRoom) {
  //       chatRoom = await this.createChatRoom(
  //         joinChatRoomDto.name || '새 채팅방',
  //         user,
  //       );
  //     }
  //     // else {
  //       // const participantExist = chatRoom.participants.some(
  //       //   (participant) => participant.id === user.id,
  //       // );
  //       // if (!participantExist) {
  //       //   chatRoom = await this.appendParticipant(chatRoom, user);
  //       // } else {
  //       //   console.log(user.id + '이미 참가한 유저입니다.'); //string 끼리는 더하기기
  //       //   throw new Error(`user.id + '이미 참가한 유저입니다.'`);
  //       // }
  //     // }
  //   } else {
  //     chatRoom = await this.createChatRoom(
  //       joinChatRoomDto.name || '새 채팅방',
  //       user,
  //     );
  //     console.log(`${user.name}이 ${joinChatRoomDto.name} 을 개설하였습니다`);
  //   }
  //   return chatRoom;
  // }
  async joinChatRoom(joinChatRoomDto: JoinChatRoomDto) {
    const { chatRoomId, name, participantId } = joinChatRoomDto;
    const user = await this.usersService.findUserById(participantId);
    if (!user) throw new Error('유저가 없습니다.');

    let chatRoom = chatRoomId ? await this.findChatRoomById(chatRoomId) : null;
    if (!chatRoom) {
      chatRoom = await this.createChatRoom(name || '새로운 채팅방', user);
    } else {
      if (
        chatRoom.participants.some((participant) => participant.id === user.id)
      ) {
        throw new Error(user.id + '이미 참가한 유저입니다.');
      }
      chatRoom = await this.appendParticipant(chatRoom, user);
    }
    return chatRoom;
  }

  createChatRoom(name: string, participant: User) {
    //이미 검증되어서 디티오 안만든다.
    const chatRoom = this.chatRoomRepository.create({
      name,
      participants: [participant],
    });
    return this.chatRoomRepository.save(chatRoom);
    //밑에 로직이 없으므로 어싱크 안씀씀
  }

  appendParticipant(chatRoom: ChatRoom, participant: User) {
    chatRoom.participants.push(participant);
    return this.chatRoomRepository.save(chatRoom);
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const chatRoom = await this.findChatRoomById(createMessageDto.chatRoomId);
    const user = await this.usersService.findUserById(
      createMessageDto.senderId,
    );

    if (!chatRoom || !user) {
      console.error('❌ chatRoom or user not found!', { chatRoom, user });
      throw new Error('해당하는 chatRoom 또는 User가 없습니다.');
    }

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      chatRoom,
      sender: user,
    });
    console.log('✅ message saved:', message);
    return await this.messageRepository.save(message);
  }

  async leaveChatRoom(leaveChatRoomDto: LeaveChatRoomDto) {
    const { chatRoomId, participantId } = leaveChatRoomDto;

    const chatRoom = await this.findChatRoomById(chatRoomId);
    if (!chatRoom) {
      throw new Error('채팅방이 없습니다.');
    }
    const user = await this.usersService.findUserById(participantId);
    if (!user) {
      throw new Error('존재하지 않는 유저입니다.');
    }

    const idx = chatRoom.participants.findIndex(
      (participant) => participant.id === user.id,
    );
    if (idx === -1) throw new Error('채팅방에 참가하지 않은 유저입니다.');

    chatRoom.participants.splice(idx, 1);

    if (chatRoom.participants.length === 0) {
      chatRoom.isActive = false;
    }
    return await this.chatRoomRepository.save(chatRoom);
  }

  async updateMessage(editMessageDto: EditMessageDto) {
    const { messageId, content, userId } = editMessageDto;

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender']
    });

    if (!message) {
      throw new Error('해당하는 메시지가 없습니다.');
    }
    if (!(message.sender.id === userId)) {
      throw new Error('수정 권한이 없습니다.');
    }

    message.content = content;
    return await this.messageRepository.save(message);
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender'],
    });
    if (!message) {
      throw new Error('해당하는 메시지가 없습니다.');
    }
    if (message.sender.id !== userId) {
      throw new Error('삭제제 권한이 없습니다.');
    }
    return await this.messageRepository.remove(message);
  }
}
