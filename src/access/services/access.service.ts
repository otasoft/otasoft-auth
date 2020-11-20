import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

import { AccessControlDto } from 'src/auth/dto/access-control.dto';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';
import { IJwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { GetUserIdQuery } from 'src/auth/queries/impl';

@Injectable()
export class AccessService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly queryBus: QueryBus,
  ) {}

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.validateToken({ jwt });

    const isTokenValidated = Boolean(jwtTokenPayload);

    if (!jwtTokenPayload.exp && !isTokenValidated)
      throw new RpcException({
        statusCode: 401,
        errorStatus: 'Token has expired, please sign in',
      });

    const authObject = await this.queryBus.execute(
      new GetUserIdQuery({ payload: jwtTokenPayload.jwt_payload }),
    );

    if (authObject.auth_id !== id)
      throw new RpcException({
        statusCode: 403,
        errorStatus: 'Forbidden resource',
      });

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
