import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserWriteRepository } from '../../../../db/repositories';
import { GenerateForgotPasswordTokenCommand } from '../impl';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { TokenService } from '../../../authorization/services';

@CommandHandler(GenerateForgotPasswordTokenCommand)
export class GenerateForgotPasswordTokenHandler
  implements ICommandHandler<GenerateForgotPasswordTokenCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: GenerateForgotPasswordTokenCommand) {
    const { userId } = command;

    const user = await this.userWriteRepository.findOne({ id: userId });

    try {
      const forgotPasswordToken = this.tokenService.signWithSecret(command, {
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
