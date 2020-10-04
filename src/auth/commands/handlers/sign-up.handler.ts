import { SignUpCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: SignUpCommand) {
        return this.userRepository.signUp(command.authCredentials);
    }
}