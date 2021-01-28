import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtTokenService } from '../../../passport-jwt/services';
import { UserWriteRepository } from '../../../../db/repositories';
import { GenerateForgotPasswordTokenCommand } from '../impl/generate-forgot-password-token.command';
import { RpcExceptionService } from '../../../../utils/exception-handling';

@CommandHandler(GenerateForgotPasswordTokenCommand)
export class GenerateForgotPasswordTokenHandler
  implements ICommandHandler<GenerateForgotPasswordTokenCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly jwtTokenService: JwtTokenService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(command: GenerateForgotPasswordTokenCommand) {
    const { userId } = command;

    const user = await this.userWriteRepository.findOne({ id: userId });

    try {
      const forgotPasswordToken = this.jwtTokenService.signWithSecret(command, {
        expiresIn: '2d',
      });

      user.forgotPasswordToken = forgotPasswordToken;
      await this.userWriteRepository.save(user);

      return forgotPasswordToken;
    } catch (error) {
      this.rpcExceptionService.throwCatchedException(error);
    }
  }
}
