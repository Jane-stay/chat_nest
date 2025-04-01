import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';

export class JoinChatRoomDto {
  @IsString()
  @IsOptional()
  chatRoomId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  participantId: string;
}
