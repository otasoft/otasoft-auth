import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserIdQuery } from '../impl';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';


@QueryHandler(GetUserIdQuery)
export class GetUserIdHandler implements IQueryHandler<GetUserIdQuery>{
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
        ) {}

    async execute(query: GetUserIdQuery) {
        const { email } = query.authCredentials
        const user = await this.userRepository.findOne({ email })

        if (!user) {
            throw new RpcException('User does not exist')
        }

        return { auth_id: user.id }
    }
}