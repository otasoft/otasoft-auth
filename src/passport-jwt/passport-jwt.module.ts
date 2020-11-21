import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../db/repositories';
import { JwtStrategy } from './strategies';
import { jwtModuleOptions } from './config/jwt-module-options';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync(jwtModuleOptions),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    providers: [ConfigService, JwtStrategy],
    exports: [PassportJwtModule, JwtStrategy, JwtModule]
})
export class PassportJwtModule {}
