import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        if(!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username }
        const accessToken: string = await this.jwtService.sign(payload)

        return { accessToken }
    }

    async getUserId(authCredentialsDto: AuthCredentialsDto): Promise<number> {
        const { username } = authCredentialsDto;

        const user = await this.userRepository.findOne({ username })

        if (!user) {
            throw new RpcException('User does not exist')
        }

        return user.id;
    }

    validateToken(jwt: string) {
        return this.jwtService.verify(jwt);
    }
}
