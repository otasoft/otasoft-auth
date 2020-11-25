import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../../db/repositories';
import { JwtTokenService } from './services';
import { jwtModuleOptions } from './config/jwt-module-options';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [ConfigService, JwtTokenService],
  exports: [PassportJwtModule, JwtModule, JwtTokenService],
})
export class PassportJwtModule {}
