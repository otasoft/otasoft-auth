import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { LocalUserRepository } from './repositories/local-user.repository';
import { LocalUserEntity } from './repositories/local-user.entity';
import { QueryHandlers } from './queries/handlers'
import { CommandHandlers } from './commands/handlers';
import { jwtModuleOptions } from './jwt/jwt-module-options';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([
      LocalUserRepository,
      LocalUserEntity
    ]),
    CqrsModule
  ],
  controllers: [LocalAuthController],
  providers: [
    LocalAuthService,
    JwtStrategy,
    ConfigService,
    ...QueryHandlers,
    ...CommandHandlers
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class LocalAuthModule {}
