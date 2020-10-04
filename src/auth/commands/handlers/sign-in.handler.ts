import { SignInCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/auth/repositories/user.repository";
import { UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "src/auth/jwt/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    async execute(command: SignInCommand) {
        const email = await this.userRepository.validateUserPassword(command.authCredentials);

        if(!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email }
        const accessToken: string = await this.jwtService.sign(payload)

        return { accessToken }
    }
}