import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { RpcExceptionService } from '../../../../utils/exception-handling';
import { UserWriteRepository } from '../../../../db/repositories';
import { PasswordUtilsService } from '../../../../utils/password-utils';
import { ChangeUserPasswordCommand } from '../impl';

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordHandler
  implements ICommandHandler<ChangeUserPasswordCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(command: ChangeUserPasswordCommand) {
    const user = await this.userWriteRepository.findOne({
      id: command.changePasswordDto.id,
    });

    if (!user) this.rpcExceptionService.throwNotFound('User not found');

    if (
      await this.passwordUtilsService.validatePassword(
        command.changePasswordDto.changePasswordData.old_password,
        user.password,
      )
    ) {
      try {
        const salt = await this.passwordUtilsService.generateSalt();
        user.password = await this.passwordUtilsService.hashPassword(
          command.changePasswordDto.changePasswordData.new_password,
          salt,
        );
        await this.userWriteRepository.save(user);
        return {
          response: 'Password changed successfuly',
        };
      } catch (error) {
        this.rpcExceptionService.throwCatchedException(error);
      }
    } else {
      this.rpcExceptionService.throwForbidden('Old password is invalid');
    }
  }
}
