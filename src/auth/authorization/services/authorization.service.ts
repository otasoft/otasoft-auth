import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { IJwtPayload } from '../../passport-jwt/interfaces';
import { GetUserIdQuery } from '../../user/queries/impl/get-user-id.query';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { JwtTokenService } from '../../passport-jwt/services';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.validateToken({ jwt });

    const isTokenValidated = Boolean(jwtTokenPayload);

    if (!jwtTokenPayload.exp && !isTokenValidated)
      this.rpcExceptionService.throwUnauthorised(
        'Token has expired, please sign in',
      );

    const authObject = await this.queryBus.execute(
      new GetUserIdQuery({ payload: jwtTokenPayload.jwt_payload }),
    );

    if (authObject.auth_id !== id)
      this.rpcExceptionService.throwForbidden('Forbidden resource');

    return isTokenValidated && authObject.auth_id === id;
  }

  validateToken(jwtDataObject: JwtAuthDto) {
    return this.jwtTokenService.validateToken(jwtDataObject);
  }
}
