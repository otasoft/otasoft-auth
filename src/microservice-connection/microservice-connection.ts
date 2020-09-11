import { Transport } from "@nestjs/microservices";

export const authMicroserviceOptions = {
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
  }