import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { RpcExceptionService } from '../../../utils/exception-handling';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  /**
   * Method that verifies the provided jwt token
   * Uses `jwtService.verify()` method to verify the token.
   * @param {string} [token]
   * @return {*}  {verified value | false}
   * @memberof TokenService
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const res = await this.jwtService.verify(token, {
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
   * Method that signs the provided payload with token
   * Uses `jwtService.sign()` method to sign the payload, adds secret, and set sign options (i.e. expiresIn value).
   * @param {string | object} [payload]
   * @param {JwtSignOptions} [options]
   * @return {string} `token`
   * @memberof TokenService
   */
  signWithSecret(payload: string | object, options: JwtSignOptions): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('EMAIL_SECRET'),
      ...options,
    });
  }
}
