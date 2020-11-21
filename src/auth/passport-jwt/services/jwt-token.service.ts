import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtAuthDto } from '../../authorization/dto';
import { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Method that validates the provided jwt object with token
   * Uses `jwtService.verify()` method to validate the token.
   * @param {JwtAuthDto} [jwtDataObject]
   * @return {*}  {verified value | false}
   * @memberof JwtTokenService
   */
  validateToken(jwtDataObject: JwtAuthDto) {
    const { jwt } = jwtDataObject;
    try {
      const res = this.jwtService.verify(jwt);

      return res;
    } catch (e) {
      return false;
    }
  }

  /**
   * Method that creates signed access token that can be used as Bearer Token or as a part of Cookie.
   * Uses `jwtService.sign()` method to sign the payload.
   * @param {*} [jwtPayload]
   * @return {string}  {accessToken}
   * @memberof JwtTokenService
   */
  createSignedAccessToken(jwtPayload) {
    const payload: IJwtPayload = { jwt_payload: jwtPayload };
    const accessToken: string = this.jwtService.sign(payload);

    return accessToken;
  }

  /**
   * Method that creates a Cookie based on JWT access token.
   * Uses `createSignedAccessToken()` method to create an access token
   * @param {*} [jwtPayload]
   * @return {string}  {accessToken}
   * @memberof JwtTokenService
   */
  createCookieWithJwtToken(jwtPayload) {
    const accessToken = this.createSignedAccessToken(jwtPayload);

    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
