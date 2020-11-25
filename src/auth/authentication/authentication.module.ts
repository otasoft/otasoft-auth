import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { UserRepository } from '../../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { PasswordUtilsService } from '../../utils/password-utils';
import { AuthorizationService } from '../authorization/services/authorization.service';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CqrsModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    ConfigService,
    PasswordUtilsService,
    ...CommandHandlers,
    AuthorizationService,
    UserService,
  ],
})
export class AuthenticationModule {}
