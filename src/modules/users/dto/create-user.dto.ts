import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterType } from '../../../common/enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '사용자 비밀번호',
  })
  @IsString()
  password?: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
  })
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(RegisterType)
  registerType: RegisterType = RegisterType.COMMON;

  @IsOptional()
  @IsString()
  socialId?: string;
}
