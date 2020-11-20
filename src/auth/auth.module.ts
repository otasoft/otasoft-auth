import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { UserRepository } from '../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { jwtModuleOptions } from './jwt/jwt-module-options';
import { PasswordUtilsService } from '../utils/password-utils';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([UserRepository]),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    PasswordUtilsService,
    ...CommandHandlers,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
