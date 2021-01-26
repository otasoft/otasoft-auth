import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { RpcExceptionService } from '../../../../utils/exception-handling';
import { UserWriteRepository } from '../../../../db/repositories';
import { AuthEmailModel } from '../../models';
import { SetNewPasswordCommand } from '../impl';
import { PasswordUtilsService } from '../../../../utils/password-utils';

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordHandler
  implements ICommandHandler<SetNewPasswordCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(command: SetNewPasswordCommand): Promise<AuthEmailModel> {
    const user = await this.userWriteRepository.findOne(command.userId);

    if (!user)
      this.rpcExceptionService.throwNotFound(
        'Cannot set new password for the user. User not found',
      );

    try {
      const salt = await this.passwordUtilsService.generateSalt();
      user.password = await this.passwordUtilsService.hashPassword(
        command.newPassword,
        salt,
      );
      // remove the forgotPasswordToken so that it cannot be used again
      user.forgotPasswordToken = '';

      await this.userWriteRepository.save(user);

      return { user_email: user.email };
    } catch (error) {
      this.rpcExceptionService.throwCatchedException(error);
    }
  }
}
