import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserIdQuery } from '../impl';
import { LocalUserRepository } from 'src/local-auth/repositories/local-user.repository';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';


@QueryHandler(GetUserIdQuery)
export class GetUserIdHandler implements IQueryHandler<GetUserIdQuery>{
    constructor(
        @InjectRepository(LocalUserRepository)
        private readonly localUserRepository: LocalUserRepository
        ) {}

    async execute(query: GetUserIdQuery) {
        const { email } = query.authCredentials
        const user = await this.localUserRepository.findOne({ email })

        if (!user) {
            throw new RpcException('User does not exist')
        }

        return user.id;
    }
}