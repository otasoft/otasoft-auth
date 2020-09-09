import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LocalAuthModule } from './local-auth/local-auth.module';
import { DbModule } from './db/db.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { FacebookAuthModule } from './facebook-auth/facebook-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    LocalAuthModule,
    GoogleAuthModule,
    FacebookAuthModule,
  ],
})
export class AppModule {}
