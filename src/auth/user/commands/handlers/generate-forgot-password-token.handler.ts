import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/db/repositories";
import { GenerateForgotPasswordTokenCommand } from "../impl/generate-forgot-password-token.command";

@CommandHandler(GenerateForgotPasswordTokenCommand)
export class GenerateForgotPasswordTokenHandler implements ICommandHandler<GenerateForgotPasswordTokenCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: GenerateForgotPasswordTokenCommand) {
        const { userId, userEmail } = command;
    }
}