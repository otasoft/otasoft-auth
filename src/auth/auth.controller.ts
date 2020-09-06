import { Controller, Body, ValidationPipe, UsePipes, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @UsePipes(new ValidationPipe)
    @MessagePattern({ role: 'user', cmd: 'register' })
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    }

    @UsePipes(new ValidationPipe)
    @MessagePattern({ role: 'user', cmd: 'login' })
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto)
    }

    // @UseGuards(JwtAuthGuard)
    @MessagePattern({ role: 'user', cmd: 'getId' })
    async getUserId(@Body() authCredentialsDto: AuthCredentialsDto): Promise<number> {
        return this.authService.getUserId(authCredentialsDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'check'})
    async loggedIn(data) {
      try {
        const res = this.authService.validateToken(data.jwt);
  
        return res;
      } catch(e) {
        Logger.log(e);
        return false;
      }
    }
}
