import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from "./jwt-payload.interface";
import { LocalUserRepository } from "../repositories/local-user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(LocalUserRepository)
        private userRepository: LocalUserRepository,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate(payload: JwtPayload) {
        const { email } = payload;
        const user = await this.userRepository.findOne({ email })
        
        if(!user) {
            throw new UnauthorizedException()
        }
        
        return user;
    }
}