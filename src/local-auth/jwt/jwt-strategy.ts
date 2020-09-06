import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { LocalUserRepository } from "../user/local-user.repository";
import { ConfigService } from "@nestjs/config";

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
        const { username } = payload;
        const user = await this.userRepository.findOne({ username })
        
        if(!user) {
            throw new UnauthorizedException()
        }
        
        return user;
    }
}