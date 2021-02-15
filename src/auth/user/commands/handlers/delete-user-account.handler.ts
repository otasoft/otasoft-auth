import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RpcExceptionService } from '../../../../utils/exception-handling';
import { UserWriteRepository } from '../../../../db/repositories';
import { DeleteUserAccountCommand } from '../impl';

@CommandHandler(DeleteUserAccountCommand)
export class DeleteUserAccountHandler
  implements ICommandHandler<DeleteUserAccountCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {
  }

  currentDate = Math.round(Date.now() / 1000);

  async execute(command: DeleteUserAccountCommand) {
    const delay30Days = 2592000;
    const termination_date = this.currentDate + delay30Days;
    try {
      await this.userWriteRepository.update(command.id, { termination_date });
      return {
        response: `User with id #${command.id} has been marked to delete`,
      };
    } catch (error) {
      this.rpcExceptionService.throwCatchedException(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteMarkedUsers() {
    const termination_date = this.currentDate;
    const terminationUsers = await this.userWriteRepository.find({ termination_date: LessThanOrEqual(termination_date) });

    if (terminationUsers && terminationUsers.length > 0) {
      terminationUsers.forEach(({ id }) => this.userWriteRepository.delete(id));
    }
  }
}
