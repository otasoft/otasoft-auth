import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { RpcExceptionService } from '../../utils/exception-handling';
import {
  ChangeUserPasswordCommand,
  ConfirmAccountCreationCommand,
  DeleteUserAccountCommand,
} from '../commands/impl';
import { AuthConfirmationDto, ChangePasswordDto, GetUserIdDto } from '../dto';
import { IConfirmedAccountObject } from '../interfaces';
import { GetConfirmedUserQuery, GetUserIdQuery } from '../queries/impl';

@Injectable()
export class UserService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

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
}
