import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { QueryBus, CommandBus } from '@nestjs/cqrs'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { GetConfirmedUserQuery, GetUserIdQuery } from './queries/impl';
import { SignUpCommand, SignInCommand, ConfirmAccountCreationCommand, ChangeUserPasswordCommand, DeleteUserAccountCommand } from './commands/impl';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';
import { IConfirmedAccountObject } from './interfaces/confirmed-acount-object.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AccessControlDto } from './dto/access-control.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    async signUp(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.commandBus.execute(new SignUpCommand(authCredentialsDto));
    }

    async confirmAccountCreation(
        authConfirmationDto: AuthConfirmationDto
    ): Promise<void> {
        const accountConfirmObject: IConfirmedAccountObject = await this.queryBus.execute(new GetConfirmedUserQuery(authConfirmationDto));
        if (!accountConfirmObject) throw new BadRequestException();
        
        await this.commandBus.execute(new ConfirmAccountCreationCommand(accountConfirmObject))
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.commandBus.execute(new SignInCommand(authCredentialsDto));
    }

    async getUserId(
        authEmailDto: AuthEmailDto
    ): Promise<{ auth_id: number }> {
        return this.queryBus.execute(new GetUserIdQuery(authEmailDto));
    }

    async changeUserPassword(
        changePasswordDto: ChangePasswordDto
    ): Promise<{ response: string }> {
        return this.commandBus.execute(new ChangeUserPasswordCommand(changePasswordDto));
    }

    async deleteUserAccount(
        id: number
    ): Promise<{ response: string }> {
        return this.commandBus.execute(new DeleteUserAccountCommand(id));
    }

    validateToken(
        jwtDataObject: JwtAuthDto
    ) {
        const { jwt } = jwtDataObject;
        try {
            const res = this.jwtService.verify(jwt);
      
            return res;
        } catch(e) {
            return false;
        }
    }

    async checkAccessControl(accessControlDto: AccessControlDto): Promise<boolean> {
      const { jwt, id } = accessControlDto;
  
      const isTokenValidated = await this.validateToken({ jwt });
  
      const email: string = await this.jwtService.decode(jwt).toString();
  
      const emailDto: AuthEmailDto = {
        email
      }
  
      try {
        const auth_id = await this.queryBus.execute(new GetUserIdQuery(emailDto))
        return isTokenValidated && auth_id === id
      } catch (error) {
        throw new RpcException(error)
      }
  
    }
}

