import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { PasswordUtilsService } from '../../../../utils/password-utils';
import { UserRepository } from '../../../../db/repositories';
import { SetRefreshTokenCommand } from '../impl';

@CommandHandler(SetRefreshTokenCommand)
export class SetRefreshTokenHandler
  implements ICommandHandler<SetRefreshTokenCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(command: SetRefreshTokenCommand) {
    const hashedRefreshToken = await this.passwordUtilsService.hashContent(
      command.refreshToken,
      10,
    );

    await this.userRepository.update(command.userId, {
      hashedRefreshToken,
    });
  }
}
