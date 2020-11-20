import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../passport-jwt/jwt-strategy';
import { UserRepository } from '../db/repositories';
import { AccessController } from './controllers/access.controller';
import { AccessService } from './services/access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    CqrsModule,
  ],
  controllers: [AccessController],
  providers: [AccessService, JwtStrategy, ConfigService],
})
export class AccessModule {}
