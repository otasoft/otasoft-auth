import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { JwtStrategy } from '../passport-jwt/strategies';
import { UserRepository } from '../../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { PasswordUtilsService } from '../../utils/password-utils';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CqrsModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    ConfigService,
    PasswordUtilsService,
    ...CommandHandlers,
  ],
})
export class AuthenticationModule {}
