import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AuthCredentialsDto } from '../dto';
import { SignUpCommand, SignInCommand } from '../commands/impl';
import { UserService } from 'src/auth/user/services/user.service';
import { JwtTokenService } from 'src/auth/passport-jwt/services';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.commandBus.execute(new SignUpCommand(authCredentialsDto));
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string[]> {
    return this.commandBus.execute(new SignInCommand(authCredentialsDto));
  }

  async logout(userId: number): Promise<string[]> {
    await this.userService.removeRefreshToken(userId);

    return this.jwtTokenService.getCookiesForLogOut();
  }
}
