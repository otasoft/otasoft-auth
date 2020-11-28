import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { IJwtPayload } from '../../passport-jwt/interfaces';
import { GetUserIdQuery } from '../../user/queries/impl/get-user-id.query';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { JwtTokenService } from '../../passport-jwt/services';
import { SetRefreshTokenCommand } from '../commands/impl';
import { AuthCredentialsDto } from 'src/auth/authentication/dto';
import { UserService } from '../../user/services/user.service';
import { PasswordUtilsService } from '../../../utils/password-utils';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userService: UserService,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.jwtTokenService.validateToken(
      { jwt },
    );

    if (jwtTokenPayload.userId !== id)
      this.rpcExceptionService.throwForbidden('Forbidden resource');

    return true;
  }

  async setRefreshToken(refreshToken: string, userId: number) {
    return await this.commandBus.execute(
      new SetRefreshTokenCommand(refreshToken, userId),
    );
  }

  getCookieWithJwtAccessToken(id: number): string {
    return this.jwtTokenService.getCookieWithJwtAccessToken(id);
  }

  async getAuthenticatedUser(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.userService.getUserByEmail(
      authCredentialsDto.email,
    );

    if (!user) this.rpcExceptionService.throwNotFound('User not found');

    const isPasswordValidated = await this.passwordUtilsService.validatePassword(
      authCredentialsDto.password,
      user.password,
    );

    if (!isPasswordValidated)
      this.rpcExceptionService.throwUnauthorised('Password do not match');

    return user;
  }
}
