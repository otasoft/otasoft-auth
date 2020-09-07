import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { LocalUserRepository } from './user/local-user.repository';
import { LocalUserEntity } from './user/local-user.entity';
import { QueryHandlers } from './queries/handlers'
import { CommandHandlers } from './commands/handlers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
        }
      })
    }),
    TypeOrmModule.forFeature([LocalUserRepository, LocalUserEntity]),
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
