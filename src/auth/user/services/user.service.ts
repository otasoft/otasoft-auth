import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { IJwtPayload } from '../../passport-jwt/interfaces';
import { UserEntity } from '../../../db/entities';
import { RpcExceptionService } from '../../../utils/exception-handling';
import {
  ChangeUserPasswordCommand,
  ConfirmAccountCreationCommand,
  DeleteUserAccountCommand,
  RemoveRefreshTokenCommand,
  RevokeUserAccountCommand,
  SetNewPasswordCommand,
} from '../commands/impl';
import { GenerateForgotPasswordTokenCommand } from '../commands/impl/generate-forgot-password-token.command';
import {
  AuthConfirmationDto,
  AuthEmailDto,
  ChangePasswordDto,
  GetRefreshUserDto,
  GetUserIdDto,
  SetNewPasswordDto,
} from '../dto';
import { IConfirmedAccountObject } from '../interfaces';
import {
  AuthEmailModel,
  AuthIdModel,
  ForgotPasswordTokenModel,
  StringResponse,
} from '../models';
import {
  GetConfirmedUserQuery,
  GetRefreshUserQuery,
  GetUserByEmailQuery,
  GetUserByIdQuery,
  GetUserIdQuery,
} from '../queries/impl';
import { AuthCredentialsDto } from '../../authentication/dto';
import { PasswordUtilsService } from '../../../utils/password-utils';
import { TokenService } from '../../authorization/services';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly tokenService: TokenService,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async getUserId(getUserIdDto: GetUserIdDto): Promise<AuthIdModel> {
    return this.queryBus.execute(new GetUserIdQuery(getUserIdDto));
  }

  async getUserIfRefreshTokenMatches(
    getRefreshUserIdDto: GetRefreshUserDto,
  ): Promise<UserEntity> {
    return this.queryBus.execute(new GetRefreshUserQuery(getRefreshUserIdDto));
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.queryBus.execute(new GetUserByEmailQuery(email));
  }

  async getAuthenticatedUser(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.getUserByEmail(authCredentialsDto.email);

    if (!user) this.rpcExceptionService.throwNotFound('User not found');

    const isPasswordValidated = await this.passwordUtilsService.validatePassword(
      authCredentialsDto.password,
      user.password,
    );

    if (!isPasswordValidated)
      this.rpcExceptionService.throwUnauthorised('Password do not match');

    return user;
  }

  async changeUserPassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<StringResponse> {
    return this.commandBus.execute(
      new ChangeUserPasswordCommand(changePasswordDto),
    );
  }

  async deleteUserAccount(id: number): Promise<StringResponse> {
    return this.commandBus.execute(new DeleteUserAccountCommand(id));
  }

  async confirmAccountCreation(
    authConfirmationDto: AuthConfirmationDto,
  ): Promise<void> {
    const accountConfirmObject: IConfirmedAccountObject = await this.queryBus.execute(
      new GetConfirmedUserQuery(authConfirmationDto),
    );

    if (!accountConfirmObject) this.rpcExceptionService.throwBadRequest();

    await this.commandBus.execute(
      new ConfirmAccountCreationCommand(accountConfirmObject),
    );
  }

  async removeRefreshToken(userId: number): Promise<void> {
    return await this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }

  async forgotPassword(
    authEmailDto: AuthEmailDto,
  ): Promise<ForgotPasswordTokenModel> {
    const user: UserEntity = await this.queryBus.execute(
      new GetUserByEmailQuery(authEmailDto.email),
    );

    if (!user) return;

    const token = await this.commandBus.execute(
      new GenerateForgotPasswordTokenCommand(user.id, user.email),
    );

    return token;
  }

  async revokeUserAccount(id: number): Promise<StringResponse> {
    return this.commandBus.execute(new RevokeUserAccountCommand(id));
  }

  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
  ): Promise<AuthEmailModel> {
    const payload: IJwtPayload = await this.tokenService.verifyToken(
      setNewPasswordDto.forgotPasswordToken,
    );

    if (!payload.userEmail || !payload.userId)
      this.rpcExceptionService.throwUnauthorised('Token expired or broken');

    return await this.commandBus.execute(
      new SetNewPasswordCommand(setNewPasswordDto.newPassword, payload.userId),
    );
  }
}
