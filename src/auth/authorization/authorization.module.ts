import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWriteRepository } from '../../db/repositories';
import { AuthorizationController } from './controllers/authorization.controller';
import { AuthorizationService, TokenService } from './services';
import { CommandHandlers } from './commands/handlers';
import { CookieService } from '../authentication/services';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWriteRepository]), CqrsModule],
  controllers: [AuthorizationController],
  providers: [
    AuthorizationService,
    CookieService,
    TokenService,
    ConfigService,
    UserService,
    ...CommandHandlers,
  ],
  exports: [TokenService, AuthorizationService],
})
export class AuthorizationModule {}
