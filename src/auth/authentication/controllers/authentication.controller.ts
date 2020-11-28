import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthenticationService } from '../services/authentication.service';
import { AuthCredentialsDto } from '../dto';
import { UserWithCookiesModel } from '../models';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern({ role: 'auth', cmd: 'register' })
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authenticationService.signUp(authCredentialsDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ role: 'auth', cmd: 'login' })
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<UserWithCookiesModel> {
    return this.authenticationService.signIn(authCredentialsDto);
  }

  @MessagePattern({ role: 'auth', cmd: 'logout' })
  async logout(userId: number): Promise<string[]> {
    return this.authenticationService.logout(userId);
  }
}
