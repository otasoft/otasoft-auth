import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';

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
    AuthModule,
    DbModule
  ],
})
export class AppModule {}
