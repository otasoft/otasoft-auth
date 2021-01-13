import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { RpcExceptionService } from '../../../utils/exception-handling';
import { IJwtObject } from '../interfaces';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  /**
   * Method that validates the provided jwt object with token
   * Uses `jwtService.verify()` method to validate the token.
   * @param {JwtAuthDto} [jwtDataObject]
   * @return {*}  {verified value | false}
   * @memberof JwtTokenService
   */
  async validateToken(jwtDataObject: IJwtObject) {
    const { jwt } = jwtDataObject;

    try {
      const res = await this.jwtService.verify(jwt, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });

      return res;
    } catch (error) {
      if (error.expiredAt) {
        this.rpcExceptionService.throwUnauthorised(
          'Token has expired, please sign in',
        );
      }
      return false;
    }
  }

  /**
   * Method that signes the provided payload with token
   * Uses `jwt.sign()` method to sign the payload, adds secret, and set sign options (i.e. expiresIn value).
   * @param {string | object} [payload]
   * @param {jwt.SignOptions} [options]
   * @return {string} `token`
   * @memberof JwtTokenService
   */
  signWithSecret(payload: string | object, options: jwt.SignOptions): string {
    return jwt.sign(
      payload,
      this.configService.get<string>('EMAIL_SECRET'),
      options,
    );
  }

  /**
   * Method that verifies the token
   * Uses `jwt.verify()` method to verify the token and adds secret
   * @param {string | object} [payload]
   * @param {jwt.SignOptions} [options]
   * @return {string} `token`
   * @memberof JwtTokenService
   */
  verifyToken(token: string): any {
    return jwt.verify(token, this.configService.get<string>('EMAIL_SECRET'));
  }

  public getCookieWithJwtAccessToken(userId: number) {
    const payload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
