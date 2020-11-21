import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AuthCredentialsDto } from '../dto';
import { SignUpCommand, SignInCommand } from '../commands/impl';

@Injectable()
export class AuthenticationService {
  constructor(private readonly commandBus: CommandBus) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.commandBus.execute(new SignUpCommand(authCredentialsDto));
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.commandBus.execute(new SignInCommand(authCredentialsDto));
  }

  async logout(): Promise<{ response: string }> {
    return new Promise((resolve, reject) => {
      resolve({ response: 'Successfuly logged out' });
    });
  }
}
