import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {LessThanOrEqual} from "typeorm";
import {Cron, CronExpression} from '@nestjs/schedule';

import {RpcExceptionService} from '../../../../utils/exception-handling';
import {UserWriteRepository} from '../../../../db/repositories';
import {DeleteUserAccountCommand} from '../impl';



@CommandHandler(DeleteUserAccountCommand)
export class DeleteUserAccountHandler
    implements ICommandHandler<DeleteUserAccountCommand> {
    constructor(
        @InjectRepository(UserWriteRepository)
        private readonly userWriteRepository: UserWriteRepository,
        private readonly rpcExceptionService: RpcExceptionService,
    ) {
    }

    dateFormatter = (delay = 0) => {
        const date = new Date();
        date.setDate(date.getDate() - delay);
        return date.getUTCFullYear() + "-" +("0" + (date.getUTCMonth()+1)).slice(-2) + "-" +("0" + date.getUTCDate()).slice(-2)
    }

    async execute(command: DeleteUserAccountCommand) {
        const termination_date = this.dateFormatter(30)
        try {
            await this.userWriteRepository.update(command.id, {termination_date})
            return {
                response: `User with id #${command.id} has been marked to delete`,
            };
        } catch (error) {
            this.rpcExceptionService.throwCatchedException(error);
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteMarkedUsers() {
        const currentDate = this.dateFormatter()
        const terminationUsers = await this.userWriteRepository.find({termination_date: LessThanOrEqual(currentDate)})

        if (terminationUsers && terminationUsers.length > 0) {
            terminationUsers.forEach(({id}) => this.userWriteRepository.delete(id))
        }
    }
}
