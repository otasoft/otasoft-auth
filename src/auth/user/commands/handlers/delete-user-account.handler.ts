import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RpcExceptionService } from '../../../../utils/exception-handling';
import { UserWriteRepository } from '../../../../db/repositories';
import { DeleteUserAccountCommand } from '../impl';
import { DelayExpression } from '../../../../utils/delay-expression';

@CommandHandler(DeleteUserAccountCommand)
export class DeleteUserAccountHandler
  implements ICommandHandler<DeleteUserAccountCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  currentDate = Math.round(Date.now() / 1000);

  async execute(command: DeleteUserAccountCommand) {
    const termination_date = this.currentDate + DelayExpression.DELAY_30_DAYS;
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
    const terminationUsers = await this.userWriteRepository.find({
      termination_date: LessThanOrEqual(this.currentDate),
    });

    if (terminationUsers && terminationUsers.length > 0) {
      terminationUsers.forEach(({ id }) => this.userWriteRepository.delete(id));
    }
  }
}
