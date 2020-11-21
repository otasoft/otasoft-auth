import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../passport-jwt/strategies';
import { UserRepository } from '../db/repositories';
import { AuthorizationController } from './controllers/authorization.controller';
import { AuthorizationService } from './services/authorization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    CqrsModule,
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, JwtStrategy, ConfigService],
})
export class AuthorizationModule {}
