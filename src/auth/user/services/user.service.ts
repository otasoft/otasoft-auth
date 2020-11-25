import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { RpcExceptionService } from '../../../utils/exception-handling';
import {
  ChangeUserPasswordCommand,
  ConfirmAccountCreationCommand,
  DeleteUserAccountCommand,
  RemoveRefreshTokenCommand,
} from '../commands/impl';
import { AuthConfirmationDto, ChangePasswordDto, GetRefreshUserIdDto, GetUserIdDto } from '../dto';
import { IConfirmedAccountObject } from '../interfaces';
import { AuthIdModel, StringResponse } from '../models';
import { GetConfirmedUserQuery, GetRefreshUserIdQuery, GetUserIdQuery } from '../queries/impl';

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

  async getUserIdIfRefreshTokenMatches(
    getRefreshUserIdDto: GetRefreshUserIdDto
  ): Promise<AuthIdModel> {
    return this.queryBus.execute(
      new GetRefreshUserIdQuery(getRefreshUserIdDto)
    );
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

  async removeRefreshToken(
    userId: number
  ): Promise<void> {
    return await this.commandBus.execute(new RemoveRefreshTokenCommand(userId));
  }
}
