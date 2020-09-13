import { Controller, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthService } from './local-auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';

@Controller('auth')
export class LocalAuthController {
    constructor(
        private readonly localAuthService: LocalAuthService
    ) {}

    @MessagePattern({ role: 'local-auth', cmd: 'register' })
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.localAuthService.signUp(authCredentialsDto)
    }

    @MessagePattern({ role: 'local-auth', cmd: 'confirm' })
    async confirmAccountCreation(@Body() authConfirmationDto: AuthConfirmationDto): Promise<void> {
        return this.localAuthService.confirmAccountCreation(authConfirmationDto);
    }

    @MessagePattern({ role: 'local-auth', cmd: 'login' })
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.localAuthService.signIn(authCredentialsDto)
    }

    @MessagePattern({ role: 'local-auth', cmd: 'getId' })
    async getUserId(@Body() authCredentialsDto: AuthCredentialsDto): Promise<number> {
        return this.localAuthService.getUserId(authCredentialsDto);
    }

    @MessagePattern({ role: 'local-auth', cmd: 'checkJwt'})
    async validateToken(jwtDataObject: JwtAuthDto) {
        return this.localAuthService.validateToken(jwtDataObject);
    }
}
