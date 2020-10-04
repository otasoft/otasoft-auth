import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { QueryBus, CommandBus } from '@nestjs/cqrs'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { GetConfirmedUserQuery, GetUserIdQuery } from './queries/impl';
import { SignUpCommand, SignInCommand, ConfirmAccountCreationCommand } from './commands/impl';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';
import { IConfirmedAccountObject } from './interfaces/confirmed-acount-object.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.commandBus.execute(new SignUpCommand(authCredentialsDto));
    }

    async confirmAccountCreation(authConfirmationDto: AuthConfirmationDto): Promise<void> {
        const accountConfirmObject: IConfirmedAccountObject = await this.queryBus.execute(new GetConfirmedUserQuery(authConfirmationDto));
        if (!accountConfirmObject) throw new BadRequestException();
        
        await this.commandBus.execute(new ConfirmAccountCreationCommand(accountConfirmObject))
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
