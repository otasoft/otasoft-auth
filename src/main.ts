import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('AuthMicroservice')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_FIRST_HOST_PORT}/${process.env.RABBITMQ_DEFAULT_VHOST}` 
      ],
      queue: 'auth_queue',
      queueOptions: {
        durable: false,
      }
    }
  });

  await app.listen(() => {
    logger.log('Microservice is listening')
  });
}
bootstrap();
