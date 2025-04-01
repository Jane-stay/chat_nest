import { BaseEntity } from 'src/common/entities/base.entity';
import { ChatRoom } from 'src/modules/chat/entities/chat-room.entity';
import { Message } from 'src/modules/chat/entities/message.entity';

import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => ChatRoom, (chatRoom) => chatRoom.participants)
  chatRooms: ChatRoom[]; //join table 은 한쪽에만

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}
