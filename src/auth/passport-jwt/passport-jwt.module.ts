import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtTokenService } from './services';
import { jwtModuleOptions } from './config/jwt-module-options';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
  ],
  providers: [ConfigService, JwtTokenService],
  exports: [PassportJwtModule, JwtModule, JwtTokenService],
})
export class PassportJwtModule {}
