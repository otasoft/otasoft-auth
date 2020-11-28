import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../../db/repositories';
import { AuthorizationController } from './controllers/authorization.controller';
import { AuthorizationService } from './services/authorization.service';
import { CommandHandlers } from './commands/handlers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CqrsModule, UserModule],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, ConfigService, ...CommandHandlers],
})
export class AuthorizationModule {}
