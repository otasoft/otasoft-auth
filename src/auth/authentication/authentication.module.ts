import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService, CookieService } from './services';
import { UserWriteRepository } from '../../db/repositories';
import { CommandHandlers } from './commands/handlers';
import { AuthorizationService } from '../authorization/services/authorization.service';
import { UserService } from '../user/services/user.service';
import { PassportJwtModule } from '../passport-jwt/passport-jwt.module';
import { UtilsModule } from '../../utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserWriteRepository]),
    CqrsModule,
    PassportJwtModule,
    UtilsModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    ConfigService,
    AuthenticationService,
    CookieService,
    AuthorizationService,
    UserService,
    ...CommandHandlers,
  ],
})
export class AuthenticationModule {}
