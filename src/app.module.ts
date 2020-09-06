import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LocalAuthModule } from './local-auth/local-auth.module';
import { DbModule } from './db/db.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { FacebookAuthModule } from './facebook-auth/facebook-auth.module';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'ROOT_ENGINE',
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 64320
      }
    }]),
    ConfigModule.forRoot(),
    LocalAuthModule,
    DbModule,
    GoogleAuthModule,
    FacebookAuthModule,
  ],
})
export class AppModule {}
