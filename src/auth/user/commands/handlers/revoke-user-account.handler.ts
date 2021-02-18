import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { RpcExceptionService } from '../../../../utils/exception-handling';
import { UserWriteRepository } from '../../../../db/repositories';
import { RevokeUserAccountCommand } from '../impl';

@CommandHandler(RevokeUserAccountCommand)
export class RevokeUserAccountHandler
  implements ICommandHandler<RevokeUserAccountCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(command: RevokeUserAccountCommand) {
    try {
      await this.userWriteRepository.update(command.id, {
        termination_date: null,
      });
      return {
        response: `User with id #${command.id} has been revoked`,
      };
    } catch (error) {
      this.rpcExceptionService.throwCatchedException(error);
    }
  }
}
