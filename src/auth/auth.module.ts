import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './repositories/user.entity';
import { QueryHandlers } from './queries/handlers'
import { CommandHandlers } from './commands/handlers';
import { jwtModuleOptions } from './jwt/jwt-module-options';
import { PasswordUtilsService } from 'src/utils/password-utils.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([
      UserRepository,
      UserEntity
    ]),
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ConfigService,
    PasswordUtilsService,
    ...QueryHandlers,
    ...CommandHandlers
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
