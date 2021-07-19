import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ACCESS_TOKEN,
  ONE_DAY,
  ONE_HOUR,
  REFRESH_TOKEN,
} from 'src/common/constants';
import { ErrorMessage } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository, UsingJoinColumnIsNotAllowedError } from 'typeorm';
import { AuthService } from './auth.service';
import { RoleType } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const roles = this.reflector.get<RoleType>('roles', context.getHandler());
    if (!roles) return true;

    const accessToken = gqlContext.cookies[ACCESS_TOKEN];
    const refreshToken = gqlContext.cookies[REFRESH_TOKEN];

    if (!accessToken) {
      // access_token, refresh_token 둘 다 없을 때 로그아웃 요청하기
      if (!refreshToken) throw new ForbiddenException(ErrorMessage.DO_LOGOUT);
      // refresh_token은 있을 떄 refresh_token을 통해서 access_token 요청하기
      throw new ForbiddenException(ErrorMessage.NOT_FOUND_ACCESS_TOKEN);
    }

    const decodedToken = await this.authService.decodedToken(accessToken);
    const now = new Date().getTime();
    const diff = decodedToken.exp * 1000 - now;

    // 만료기간 지남
    if (diff > ONE_HOUR) {
      // refresh 토큰이 없거나 refresh 토큰도 만료기간이 지났으면 로그아웃
      if (!refreshToken) throw new ForbiddenException(ErrorMessage.DO_LOGOUT);

      const refreshTokenDecoded = await this.authService.decodedToken(
        refreshToken,
      );
      const diff = refreshTokenDecoded.exp - now;
      if (diff > ONE_DAY * 30) {
        throw new ForbiddenException(ErrorMessage.DO_LOGOUT);
      }

      // access_token만 만료되서 client에서 access_token 재요청
      throw new ForbiddenException(ErrorMessage.EXPIRE_ACCESS_TOKEN);
    }

    // correct action
    const user = await this.users.findOne(decodedToken.id);
    gqlContext['user'] = user;
    return true;
  }
}
