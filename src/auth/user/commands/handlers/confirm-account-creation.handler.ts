import { ConfirmAccountCreationCommand } from '../impl';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserWriteRepository } from '../../../../db/repositories';

@CommandHandler(ConfirmAccountCreationCommand)
export class ConfirmAccountCreationCommandHandler
  implements ICommandHandler<ConfirmAccountCreationCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
  ) {}

  async execute(command: ConfirmAccountCreationCommand) {
    const { isAccountConfirmed, userId } = command.accountConfirmObject;
    await this.userWriteRepository.update(userId, {
      is_confirmed: isAccountConfirmed,
    });
  }
}
