import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UtilsModule } from './utils/utils.module';
import { HealthModule } from './health/health.module';
import { AccessModule } from './access/access.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TerminusModule,
    ScheduleModule.forRoot(),
    DbModule,
    AuthModule,
    UtilsModule,
    HealthModule,
    AccessModule,
  ],
})
export class AppModule {}
