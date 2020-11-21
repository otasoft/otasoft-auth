import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandHandlers } from './commands/handlers';
import { JwtStrategy } from '../passport-jwt/strategies';
import { QueryHandlers } from './queries/handlers';
import { UserRepository } from '../../db/repositories';
import { PasswordUtilsService } from '../../utils/password-utils';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CqrsModule],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    ConfigService,
    PasswordUtilsService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class UserModule {}
