import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { UserRepository, UserWriteRepository } from '../../db/repositories';
import { PasswordUtilsService } from '../../utils/password-utils';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PassportJwtModule } from '../passport-jwt/passport-jwt.module';
import { UtilsModule } from '../../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserWriteRepository]),
    CqrsModule,
    PassportJwtModule,
    UtilsModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    PasswordUtilsService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [UserService],
})
export class UserModule {}
