import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWriteRepository } from '../../db/repositories';
import { AuthorizationController } from './controllers/authorization.controller';
import { AuthorizationService } from './services/authorization.service';
import { CommandHandlers } from './commands/handlers';
import { UserModule } from '../user/user.module';
import { CookieService } from '../authentication/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWriteRepository]),
    CqrsModule,
    UserModule,
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, CookieService, ConfigService, ...CommandHandlers],
})
export class AuthorizationModule {}
