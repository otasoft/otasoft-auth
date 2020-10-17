import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from 'src/auth/repositories/user.repository';
import { PasswordUtilsService } from 'src/utils/password-utils.service';
import { ChangeUserPasswordCommand } from '../impl';

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordHandler
  implements ICommandHandler<ChangeUserPasswordCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(command: ChangeUserPasswordCommand) {
    const user = await this.userRepository.findOne({
      id: command.changePasswordDto.id,
    });

    if (!user)
      throw new RpcException({
        statusCode: 403,
        errorStatus: 'User not found',
      });

    if (
      await user.validatePassword(
        command.changePasswordDto.changePasswordDto.old_password,
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
        throw new RpcException(error);
      }
    } else {
      throw new RpcException({
        statusCode: 403,
        errorStatus: 'Old password is invalid',
      });
    }
  }
}
