import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChangeUserPasswordCommand, ConfirmAccountCreationCommand, DeleteUserAccountCommand } from 'src/auth/commands/impl';
import { AuthConfirmationDto } from 'src/auth/dto/auth-confirmation.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { GetUserIdDto } from 'src/auth/dto/get-user-id.dto';
import { IConfirmedAccountObject } from 'src/auth/interfaces/confirmed-acount-object.interface';
import { GetConfirmedUserQuery, GetUserIdQuery } from 'src/auth/queries/impl';

@Injectable()
export class UserService {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus
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
        if (!accountConfirmObject) throw new BadRequestException();

        await this.commandBus.execute(
            new ConfirmAccountCreationCommand(accountConfirmObject),
        );
    }
}
