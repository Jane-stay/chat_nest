import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { RequestOrigin } from 'src/decorators/request-origin.decorator';
import { Response, Request } from 'express';

@ApiTags('유저인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiBody({ type: LogInDto })
  @Post('login')
  async login(
    @Body() loginDto: LogInDto,
    @Res() res: Response,
    @RequestOrigin() origin,
  ) {
    const { accessToken, accessOption, refreshToken, refreshOption } =
      await this.authService.logIn(loginDto, origin);
    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return res.json({ message: '로그인 성공!', accessToken, refreshToken });
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@Res() res: Response, @RequestOrigin() origin) {
    const { accessOption, refreshOption } =
      this.authService.expireJwtToken(origin);
    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
    res.json({
      message: '로그아웃',
    });
  }
}
