import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './repositories/user.entity';
import { QueryHandlers } from './queries/handlers';
import { CommandHandlers } from './commands/handlers';
import { jwtModuleOptions } from './jwt/jwt-module-options';
import { PasswordUtilsService } from '../utils/password-utils';
import { AccessController } from './controllers/access/access.controller';
import { AccessService } from './services/access/access.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([UserRepository, UserEntity]),
    CqrsModule,
  ],
  controllers: [AuthController, AccessController, UserController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    PasswordUtilsService,
    ...QueryHandlers,
    ...CommandHandlers,
    AccessService,
    UserService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
