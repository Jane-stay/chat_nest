import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.chatRooms, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  participants: User[];

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
