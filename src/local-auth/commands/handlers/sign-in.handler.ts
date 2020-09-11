import { SignInCommand } from "../impl";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from "@nestjs/typeorm";
import { LocalUserRepository } from "src/local-auth/repositories/local-user.repository";
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
        const email = await this.localUserRepository.validateUserPassword(command.authCredentials);

        if(!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email }
        const accessToken: string = await this.jwtService.sign(payload)

        return { accessToken }
    }
}