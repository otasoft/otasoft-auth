import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RpcException } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";
import { ChangeUserPasswordCommand } from "../impl";

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordHandler implements ICommandHandler<ChangeUserPasswordCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: ChangeUserPasswordCommand) {
        const user = await this.userRepository.findOne({ id: command.changePasswordDto.id });

        if (user && await user.validatePassword(command.changePasswordDto.changePasswordDto.old_password)) {
            try {
                user.password = command.changePasswordDto.changePasswordDto.new_password;
                await this.userRepository.save(user);
                return {
                    response: 'Password changed successfuly'
                }
            } catch(error) {
                throw new RpcException(error)
            }
        } else {
            throw new NotFoundException('User not found')
        }
    }
}