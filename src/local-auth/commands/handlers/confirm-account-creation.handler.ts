import { ConfirmAccountCreationCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { LocalUserRepository } from "src/local-auth/repositories/local-user.repository";

@CommandHandler(ConfirmAccountCreationCommand)
export class ConfirmAccountCreationCommandHandler implements ICommandHandler<ConfirmAccountCreationCommand> {
    constructor(
        @InjectRepository(LocalUserRepository)
        private readonly localUserRepository: LocalUserRepository,
    ) {}

    async execute(command: ConfirmAccountCreationCommand) {
        const { isAccountConfirmed, userId } = command.accountConfirmObject;
        await this.localUserRepository.update(userId, { is_confirmed: isAccountConfirmed });
    }
}