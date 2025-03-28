import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret!,
    });
  }

  async validate(payload: any) {
    try {
      const { sub } = payload;
      const user = await this.usersService.findOneByEmail(sub);
      const { password, ...rest } = user;
      return rest;
    } catch (err) {
      throw new ForbiddenException('알 수 없는 에러');
    }
  }
}
