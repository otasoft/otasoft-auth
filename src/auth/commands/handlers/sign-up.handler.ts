import { SignUpCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from "src/auth/repositories/user.repository";
import { RpcException } from "@nestjs/microservices";
import { InternalServerErrorException } from "@nestjs/common";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async execute(command: SignUpCommand) {
        const salt = await bcrypt.genSalt();
        const user = await this.userRepository.create();
        user.email = command.authCredentials.email;
        user.password = await this.hashPassword(command.authCredentials.password, salt);
        user.is_confirmed = false;

        try {
            await user.save();
            const token = jwt.sign({ userId: user.id, userEmail: user.email }, process.env.EMAIL_SECRET, { expiresIn: '2d' });
            return {
                auth_id: user.id,
                token: token
            };
        } catch(error) {
            const conflictExceptionCode = '23505';
            if(error.code === conflictExceptionCode) {
                throw new RpcException('Email already registered');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}