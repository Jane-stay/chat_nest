import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chatRoomId: string;

  @IsString()
  content: string;

  @IsString()
  senderId: string;
}
