import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('AuthMicroservice')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 64321
    }
  });

  await app.listen(() => {
    logger.log('Microservice is listening')
  });
}
bootstrap();
