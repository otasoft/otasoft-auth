import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AccessControlDto } from '../dto';
import { IJwtPayload } from '../../passport-jwt/interfaces';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { SetRefreshTokenCommand } from '../commands/impl';
import { AuthCredentialsDto } from '../../authentication/dto';
import { UserService } from '../../user/services/user.service';
import { PasswordUtilsService } from '../../../utils/password-utils';
import { CookieService } from '../../authentication/services';
import { TokenService } from './token.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly userService: UserService,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly cookieService: CookieService,
    private readonly tokenService: TokenService,
  ) {}

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.tokenService.verifyToken(
      jwt,
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
    return this.cookieService.getCookieWithJwtAccessToken(id);
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
