import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUserIdQuery } from '../impl';
import { UserRepository } from '../../../db/repositories';

@QueryHandler(GetUserIdQuery)
export class GetUserIdHandler implements IQueryHandler<GetUserIdQuery> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserIdQuery) {
    const user = await this.userRepository.findOne({
      where: { jwt_payload: query.getUserIdDto.payload },
    });

    if (!user) {
      throw new RpcException('User does not exist');
    }

    return { auth_id: user.id };
  }
}
