import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthenticationService } from '../services/authentication.service';
import { AuthCredentialsDto } from '../dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ role: 'auth', cmd: 'register' })
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authenticationService.signUp(authCredentialsDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ cookie: string }> {
    return this.authenticationService.signIn(authCredentialsDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'logout' })
  async logout(): Promise<{ response: string }> {
    return this.authenticationService.logout();
  }
}
