import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationModule } from './authentication/authentication.module';
import { DbModule } from './db/db.module';
import { UtilsModule } from './utils/utils.module';
import { HealthModule } from './health/health.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { UserModule } from './user/user.module';
import { PassportJwtModule } from './passport-jwt/passport-jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    ScheduleModule.forRoot(),
    DbModule,
    AuthenticationModule,
    UtilsModule,
    HealthModule,
    AuthorizationModule,
    UserModule,
    PassportJwtModule,
  ],
})
export class AppModule {}
