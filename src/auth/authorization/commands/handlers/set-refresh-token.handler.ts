import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { PasswordUtilsService } from '../../../../utils/password-utils';
import { UserWriteRepository } from '../../../../db/repositories';
import { SetRefreshTokenCommand } from '../impl';

@CommandHandler(SetRefreshTokenCommand)
export class SetRefreshTokenHandler
  implements ICommandHandler<SetRefreshTokenCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(command: SetRefreshTokenCommand) {
    const hashedRefreshToken = await this.passwordUtilsService.hashContent(
      command.refreshToken,
      10,
    );

    await this.userWriteRepository.update(command.userId, {
      hashedRefreshToken,
    });
  }
}
