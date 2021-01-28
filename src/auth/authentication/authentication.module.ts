import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService, CookieService } from './services';
import { UserWriteRepository } from '../../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { UserService } from '../user/services/user.service';
import { UtilsModule } from '../../utils/utils.module';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWriteRepository]),
    CqrsModule,
    UtilsModule,
    AuthorizationModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    ConfigService,
    AuthenticationService,
    CookieService,
    UserService,
    ...CommandHandlers,
  ],
})
export class AuthenticationModule {}
