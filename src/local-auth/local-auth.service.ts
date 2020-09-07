import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { QueryBus, CommandBus } from '@nestjs/cqrs'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { GetUserIdQuery } from './queries/impl';
import { SignUpCommand, SignInCommand } from './commands/impl';

@Injectable()
export class LocalAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.commandBus.execute(new SignUpCommand(authCredentialsDto));
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.commandBus.execute(new SignInCommand(authCredentialsDto));
    }

    async getUserId(authCredentialsDto: AuthCredentialsDto): Promise<number> {
        return this.queryBus.execute(new GetUserIdQuery(authCredentialsDto));
    }

    validateToken(jwtDataObject: JwtAuthDto) {
        const { jwt } = jwtDataObject;
        try {
            const res = this.jwtService.verify(jwt);
      
            return res;
        } catch(e) {
            return false;
        }
    }
}
