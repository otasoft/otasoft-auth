import { Controller, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @MessagePattern({ role: 'auth', cmd: 'register' })
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    }

    @MessagePattern({ role: 'auth', cmd: 'confirm' })
    async confirmAccountCreation(@Body() authConfirmationDto: AuthConfirmationDto): Promise<void> {
        return this.authService.confirmAccountCreation(authConfirmationDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'login' })
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto)
    }

    @MessagePattern({ role: 'auth', cmd: 'getId' })
    async getUserId(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ auth_id: number }> {
        return this.authService.getUserId(authCredentialsDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'checkJwt'})
    async validateToken(jwtDataObject: JwtAuthDto) {
        return this.authService.validateToken(jwtDataObject);
    }
}
