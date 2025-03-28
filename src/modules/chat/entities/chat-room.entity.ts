import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ChatRoom extends BaseEntity {
  @Column()
  name: string;

  @Column()
  user1Id: number;

  @Column()
  user2Id: number;
}
