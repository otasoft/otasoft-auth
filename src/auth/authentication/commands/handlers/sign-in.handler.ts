import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SignInCommand } from '../impl';
import { UserRepository } from '../../../../db/repositories';
import { PasswordUtilsService } from '../../../../utils/password-utils';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { JwtTokenService } from '../../../passport-jwt/services';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: SignInCommand) {
    const user = await this.userRepository.findOne({
      email: command.authCredentials.email,
    });

    if (!user) this.rpcExceptionService.throwNotFound('User not found')

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

        const cookie = this.jwtTokenService.createCookieWithJwtToken(jwtPayload);
        
        return { cookie };
      } catch (error) {
        this.rpcExceptionService.throwUnauthorised('Cannot sign in')
      }
    } else {
      this.rpcExceptionService.throwUnauthorised('Invalid credentials')
    }
  }
}
