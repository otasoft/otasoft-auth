import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from '../passport-jwt/jwt-strategy';
import { UserRepository } from '../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { PasswordUtilsService } from '../utils/password-utils';

@Module({
  imports: [
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
})
export class AuthModule {}
