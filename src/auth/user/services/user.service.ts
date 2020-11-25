import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEntity } from 'src/db/entities';

import { RpcExceptionService } from '../../../utils/exception-handling';
import {
  ChangeUserPasswordCommand,
  ConfirmAccountCreationCommand,
  DeleteUserAccountCommand,
  RemoveRefreshTokenCommand,
} from '../commands/impl';
import {
  AuthConfirmationDto,
  ChangePasswordDto,
  GetRefreshUserDto,
  GetUserIdDto,
} from '../dto';
import { IConfirmedAccountObject } from '../interfaces';
import { AuthIdModel, StringResponse } from '../models';
import {
  GetConfirmedUserQuery,
  GetRefreshUserQuery,
  GetUserByEmailQuery,
  GetUserByIdQuery,
  GetUserIdQuery,
} from '../queries/impl';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
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
}
