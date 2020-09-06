import { Controller, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';

@Controller('auth')
export class LocalAuthController {
    constructor(
        private readonly localAuthService: LocalAuthService
    ) {}

    @UsePipes(new ValidationPipe)
    @MessagePattern({ role: 'user', cmd: 'register' })
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.localAuthService.signUp(authCredentialsDto)
    }

    @UsePipes(new ValidationPipe)
    @MessagePattern({ role: 'user', cmd: 'login' })
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.localAuthService.signIn(authCredentialsDto)
    }

    @MessagePattern({ role: 'user', cmd: 'getId' })
    async getUserId(@Body() authCredentialsDto: AuthCredentialsDto): Promise<number> {
        return this.localAuthService.getUserId(authCredentialsDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'check'})
    async loggedIn(data: JwtAuthDto) {
      try {
        const res = this.localAuthService.validateToken(data.jwt);
  
        return res;
      } catch(e) {
        return false;
      }
    }
}
