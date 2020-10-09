import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";
import { DeleteUserAccountCommand } from "../impl";

@CommandHandler(DeleteUserAccountCommand)
export class DeleteUserAccountHandler implements ICommandHandler<DeleteUserAccountCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: DeleteUserAccountCommand) {
        // TODO Check if a deleted user is currently logged user. Currently any authenticated user can delete any user profile.
        // TODO instead of imediately deleting the user account, add a column 'mark_for_deletion' with a type of boolean, and a cron job, that will delete the user account after certain amount of time.
        try {
            await this.userRepository.delete(command.id);
            return { 
                response: `User with id #${command.id} successfuly deleted` 
            };
        } catch(error) {
            throw new RpcException(error);
        }
    }
}