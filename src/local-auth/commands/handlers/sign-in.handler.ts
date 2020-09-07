import { SignInCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { LocalUserRepository } from "src/local-auth/user/local-user.repository";
import { UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "src/local-auth/jwt/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
    constructor(
        @InjectRepository(LocalUserRepository)
        private readonly localUserRepository: LocalUserRepository,
        private readonly jwtService: JwtService
    ) {}

    async execute(command: SignInCommand) {
        const username = await this.localUserRepository.validateUserPassword(command.authCredentials);

        if(!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username }
        const accessToken: string = await this.jwtService.sign(payload)

        return { accessToken }
    }
}