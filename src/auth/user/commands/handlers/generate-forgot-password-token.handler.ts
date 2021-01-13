import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtTokenService } from '../../../passport-jwt/services';
import { UserRepository } from '../../../../db/repositories';
import { GenerateForgotPasswordTokenCommand } from '../impl/generate-forgot-password-token.command';
import { RpcExceptionService } from '../../../../utils/exception-handling';

@CommandHandler(GenerateForgotPasswordTokenCommand)
export class GenerateForgotPasswordTokenHandler
  implements ICommandHandler<GenerateForgotPasswordTokenCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(command: GenerateForgotPasswordTokenCommand) {
    const { userId } = command;

    const user = await this.userRepository.findOne({ id: userId });

    try {
      const forgotPasswordToken = this.jwtTokenService.signWithSecret(command, {
        expiresIn: '2d',
      });

      user.forgotPasswordToken = forgotPasswordToken;
      await this.userRepository.save(user);

      return forgotPasswordToken;
    } catch (error) {
      this.rpcExceptionService.throwCatchedException(error);
    }
  }
}
