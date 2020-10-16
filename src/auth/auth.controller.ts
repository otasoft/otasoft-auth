import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { AuthConfirmationDto } from './dto/auth-confirmation.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthEmailDto } from './dto/auth-email.dto';
import { AccessControlDto } from './dto/access-control.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @MessagePattern({ role: 'auth', cmd: 'register' })
    async signUp(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    }

    @MessagePattern({ role: 'auth', cmd: 'confirm' })
    async confirmAccountCreation(
        authConfirmationDto: AuthConfirmationDto
    ): Promise<void> {
        return this.authService.confirmAccountCreation(authConfirmationDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'login' })
    async signIn(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto)
    }

    @MessagePattern({ role: 'auth', cmd: 'getId' })
    async getUserId(
        authEmailDto: AuthEmailDto
    ): Promise<{ auth_id: number }> {
        return this.authService.getUserId(authEmailDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'checkJwt'})
    async validateToken(
        jwtDataObject: JwtAuthDto
    ) {
        return this.authService.validateToken(jwtDataObject);
    }

    @MessagePattern({ role: 'auth', cmd: 'changePassword' })
    async changeUserPassword(
        changePasswordDto: ChangePasswordDto
    ): Promise<{ response: string }> {
        return this.authService.changeUserPassword(changePasswordDto);
    }

    @MessagePattern({ role: 'auth', cmd: 'deleteAccount' })
    async deleteUserAccount(
        id: number
    ): Promise<{ response: string }> {
        return this.authService.deleteUserAccount(id);
    }

    @MessagePattern({ role: 'auth', cmd: 'checkAccess' })
    async checkAccessControl(
      accessControlDto: AccessControlDto
    ): Promise<boolean> {
      return this.authService.checkAccessControl(accessControlDto);
    }
}
