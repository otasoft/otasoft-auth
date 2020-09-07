import { SignUpCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { LocalUserRepository } from "src/local-auth/user/local-user.repository";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        @InjectRepository(LocalUserRepository)
        private readonly localUserRepository: LocalUserRepository
    ) {}

    async execute(command: SignUpCommand) {
        return this.localUserRepository.signUp(command.authCredentials);
    }
}