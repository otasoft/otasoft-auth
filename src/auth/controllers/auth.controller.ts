import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ role: 'auth', cmd: 'register' })
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'logout' })
  async logout(): Promise<{ response: string }> {
    return this.authService.logout();
  }
}
