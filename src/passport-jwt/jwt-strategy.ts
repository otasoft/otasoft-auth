import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRepository } from '../db/repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    const { jwt_payload } = payload;
    const user = await this.userRepository.findOne({ jwt_payload });

    if (!user)
      throw new RpcException({
        statusCode: 401,
        errorStatus: 'Invalid credentials',
      });

    return Boolean(user);
  }
}
