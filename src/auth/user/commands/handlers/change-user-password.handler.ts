import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcExceptionService } from 'src/utils/exception-handling';

import { UserRepository } from '../../../../db/repositories';
import { PasswordUtilsService } from '../../../../utils/password-utils';
import { ChangeUserPasswordCommand } from '../impl';

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordHandler
  implements ICommandHandler<ChangeUserPasswordCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(command: ChangeUserPasswordCommand) {
    const user = await this.userRepository.findOne({
      id: command.changePasswordDto.id,
    });

    if (!user) this.rpcExceptionService.throwNotFound('User not found');

    if (
      await this.passwordUtilsService.validatePassword(
        command.changePasswordDto.changePasswordDto.old_password,
        user.password,
      )
    ) {
      try {
        const salt = await this.passwordUtilsService.generateSalt();
        user.password = await this.passwordUtilsService.hashPassword(
          command.changePasswordDto.changePasswordDto.new_password,
          salt,
        );
        await this.userRepository.save(user);
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
