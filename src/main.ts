import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { authMicroserviceOptions } from './microservice-connection/microservice-connection';

const logger = new Logger('AuthMicroservice');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    authMicroserviceOptions,
  );

  await app.listen(() => {
    logger.log('Microservice is listening');
  });
}
bootstrap();
