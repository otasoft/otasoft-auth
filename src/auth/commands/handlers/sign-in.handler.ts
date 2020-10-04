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
        const user = await this.userRepository.findOne({ email: command.authCredentials.email });

        if(user && await user.validatePassword(command.authCredentials.password)) {
            const payload: JwtPayload = { email: command.authCredentials.email }
            const accessToken: string = await this.jwtService.sign(payload)
    
            return { accessToken }
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}