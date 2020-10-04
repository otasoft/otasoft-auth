import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { IConfirmedAccountObject } from 'src/auth/interfaces/confirmed-acount-object.interface';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { GetConfirmedUserQuery } from '../impl';


@QueryHandler(GetConfirmedUserQuery)
export class GetConfirmedUserHandler implements IQueryHandler<GetConfirmedUserQuery>{
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        ) {}

    async execute(query: GetConfirmedUserQuery): Promise<IConfirmedAccountObject> {
        const { token } = query.authConfirmationDto;
        const dataObjectFromToken = jwt.verify(token, process.env.EMAIL_SECRET, )
        const { id, email } = (<any>dataObjectFromToken);
        const user = await this.userRepository.findOne({ where: { id: id, email: email } })

        if (!user) {
            throw new RpcException('Account not confirmed')
        }

        return {
            isAccountConfirmed: true,
            userId: id,
        };
    }
}