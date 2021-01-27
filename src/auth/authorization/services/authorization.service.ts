import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AccessControlDto } from '../dto';
import { IJwtPayload } from '../../passport-jwt/interfaces';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { SetRefreshTokenCommand } from '../commands/impl';
import { CookieService } from '../../authentication/services';
import { TokenService } from './token.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
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
}
