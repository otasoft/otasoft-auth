import { ConfirmAccountCreationCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";

@CommandHandler(ConfirmAccountCreationCommand)
export class ConfirmAccountCreationCommandHandler implements ICommandHandler<ConfirmAccountCreationCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: ConfirmAccountCreationCommand) {
        const { isAccountConfirmed, userId } = command.accountConfirmObject;
        await this.userRepository.update(userId, { is_confirmed: isAccountConfirmed });
    }
}