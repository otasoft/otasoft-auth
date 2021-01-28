import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../../../db/entities';
import { UserReadRepository } from '../../../../db/repositories';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { GetUserByEmailQuery } from '../impl';
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @InjectRepository(UserReadRepository)
    private readonly userReadRepository: UserReadRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<UserEntity> {
    const user = await this.userReadRepository.findOne({
      where: { email: query.email },
    });

    if (!user)
      this.rpcExceptionService.throwNotFound(
        'User not found by provided email',
      );

    return user;
  }
}
