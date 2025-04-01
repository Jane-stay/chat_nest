import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    const { password, ...rest } = user;
    return rest;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');
    const { password, ...rest } = user;
    return rest;
  }
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');
    user.email = updateUserDto.email;
    user.name = updateUserDto.name;
    user.password = updateUserDto.password!;

    await this.userRepository.save(user);
    const { password, ...rest } = user;
    return rest;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('유저가 없습니다.');
    await this.userRepository.delete(id);
    return `${user.name} 유저가 삭제되었습니다`;
  }


}
