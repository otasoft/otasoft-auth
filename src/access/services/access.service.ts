import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { IJwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { GetUserIdQuery } from 'src/user/queries/impl';
import { RpcExceptionService } from '../../utils/exception-handling';

@Injectable()
export class AccessService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
    private readonly rpcExceptionService: RpcExceptionService
  ) {}

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.validateToken({ jwt });

    const isTokenValidated = Boolean(jwtTokenPayload);

    if (!jwtTokenPayload.exp && !isTokenValidated) this.rpcExceptionService.throwUnauthorised('Token has expired, please sign in')

    const authObject = await this.queryBus.execute(
      new GetUserIdQuery({ payload: jwtTokenPayload.jwt_payload }),
    );

    if (authObject.auth_id !== id) this.rpcExceptionService.throwForbidden('Forbidden resource')

    return isTokenValidated && authObject.auth_id === id;
  }

  validateToken(jwtDataObject: JwtAuthDto) {
    const { jwt } = jwtDataObject;
    try {
      const res = this.jwtService.verify(jwt);

      return res;
    } catch (e) {
      return false;
    }
  }
}
