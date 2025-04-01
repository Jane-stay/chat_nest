import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Message extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
    onDelete: 'CASCADE',
  })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;
}
