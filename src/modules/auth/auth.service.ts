import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { LogInDto } from './dto/log-in.dto';
import { comparePassword } from 'src/common/password-util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return await this.usersService.createUser(createUserDto);
  }

  async logIn(loginDto: LogInDto, requestDomain: string) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!(await comparePassword(password, user.password))) {
      throw new BadRequestException('password 가 틀렸습니다');
    }
    return this.makeJwtToken(loginDto.email, requestDomain);
  }

  makeJwtToken(email: string, origin: string) {
    const { accessToken, accessOption } = this.setJwtAccessToken(email, origin);
    const { refreshToken, refreshOption } = this.setJwtRefreshToken(
      email,
      origin,
    );
    return { accessToken, accessOption, refreshToken, refreshOption };
  }

  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 1 * 24 * 60 * 60 * 1000;
    const token = this.JwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge,
    });
    return {
      accessToken: token,
      accessOption: this.setCookieOption(maxAge, requestDomain),
    };
  }
  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 15 * 24 * 60 * 60 * 1000;
    const token = this.JwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge,
    });

    return {
      refreshToken: token,
      refreshOption: this.setCookieOption(maxAge, requestDomain),
    };
  }

  setCookieOption(maxAge: number, requestDomain: string) {
    let domain: string;

    if (
      requestDomain.includes('localhost') ||
      requestDomain.includes('127.0.0.1')
    ) {
      domain = 'localhost';
    } else {
      domain = requestDomain.split(':')[0];
    }
    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax' as 'lax',
    };
  }

  expireJwtToken(requestDomain: string) {
    return {
      accessOption: this.setCookieOption(0, requestDomain),
      refreshOption: this.setCookieOption(0, requestDomain),
    };
  }
}
