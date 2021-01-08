import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../../../db/entities';
import { UserRepository } from '../../../../db/repositories';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { GetUserByEmailQuery } from '../impl';
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: query.email },
    });

    if (!user)
      this.rpcExceptionService.throwNotFound(
        'User not found by provided email',
      );

    return user;
  }
}
