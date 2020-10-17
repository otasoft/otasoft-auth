import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { GetConfirmedUserQuery, GetUserIdQuery } from './queries/impl';
import {
  SignUpCommand,
  SignInCommand,
  ConfirmAccountCreationCommand,
  ChangeUserPasswordCommand,
  DeleteUserAccountCommand,
} from './commands/impl';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';
import { IConfirmedAccountObject } from './interfaces/confirmed-acount-object.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccessControlDto } from './dto/access-control.dto';
import { GetUserIdDto } from './dto/get-user-id.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

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

  async confirmAccountCreation(
    authConfirmationDto: AuthConfirmationDto,
  ): Promise<void> {
    const accountConfirmObject: IConfirmedAccountObject = await this.queryBus.execute(
      new GetConfirmedUserQuery(authConfirmationDto),
    );
    if (!accountConfirmObject) throw new BadRequestException();

    await this.commandBus.execute(
      new ConfirmAccountCreationCommand(accountConfirmObject),
    );
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.commandBus.execute(new SignInCommand(authCredentialsDto));
  }

  async getUserId(getUserIdDto: GetUserIdDto): Promise<{ auth_id: number }> {
    return this.queryBus.execute(new GetUserIdQuery(getUserIdDto));
  }

  async changeUserPassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ response: string }> {
    return this.commandBus.execute(
      new ChangeUserPasswordCommand(changePasswordDto),
    );
  }

  async deleteUserAccount(id: number): Promise<{ response: string }> {
    return this.commandBus.execute(new DeleteUserAccountCommand(id));
  }

  validateToken(jwtDataObject: JwtAuthDto) {
    const { jwt } = jwtDataObject;
    try {
      const res = this.jwtService.verify(jwt);

      return res;
    } catch (e) {
      return false;
    }
  }

  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    const { jwt, id } = accessControlDto;

    const jwtTokenPayload: IJwtPayload = await this.validateToken({ jwt });

    const isTokenValidated = Boolean(jwtTokenPayload);

    if (!jwtTokenPayload.exp && !isTokenValidated)
      throw new RpcException({
        statusCode: 401,
        errorStatus: 'Token has expired, please sign in',
      });

    const authObject = await this.queryBus.execute(
      new GetUserIdQuery({ payload: jwtTokenPayload.jwt_payload }),
    );

    if (authObject.auth_id !== id)
      throw new RpcException({
        statusCode: 403,
        errorStatus: 'Forbidden resource',
      });

    return isTokenValidated && authObject.auth_id === id;
  }
}
