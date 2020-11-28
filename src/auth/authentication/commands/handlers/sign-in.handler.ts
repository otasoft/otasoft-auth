import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SignInCommand } from '../impl';
import { UserRepository } from '../../../../db/repositories';
import { PasswordUtilsService } from '../../../../utils/password-utils';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { JwtTokenService } from '../../../passport-jwt/services';
import { UserWithCookiesModel } from '../../models';
import { AuthorizationService } from '../../../../auth/authorization/services/authorization.service';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async execute(command: SignInCommand): Promise<UserWithCookiesModel> {
    const user = await this.userRepository.findOne({
      email: command.authCredentials.email,
    });

    if (!user) this.rpcExceptionService.throwNotFound('User not found');

    if (
      await this.passwordUtilsService.validatePassword(
        command.authCredentials.password,
        user.password,
      )
    ) {
      try {
        const jwtPayload = uuidv4();
        user.jwt_payload = jwtPayload;
        user.save();

        const accessTokenCookie = this.jwtTokenService.getCookieWithJwtAccessToken(
          user.id,
        );
        const refreshTokenCookie = this.jwtTokenService.getCookieWithJwtRefreshToken(
          user.id,
        );

        await this.authorizationService.setRefreshToken(
          refreshTokenCookie.token,
          user.id,
        );

        return {
          cookies: [accessTokenCookie, refreshTokenCookie.cookie],
          user: { email: user.email, id: user.id },
        };
      } catch (error) {
        this.rpcExceptionService.throwUnauthorised('Cannot sign in');
      }
    } else {
      this.rpcExceptionService.throwUnauthorised('Invalid credentials');
    }
  }
}
