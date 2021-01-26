import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../../../../db/entities';
import { UserReadRepository } from '../../../../db/repositories';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { GetUserByIdQuery } from '../impl';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectRepository(UserReadRepository)
    private readonly userReadRepository: UserReadRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    const user = await this.userReadRepository.findOne(query.id);

    if (!user)
      this.rpcExceptionService.throwNotFound(
        `User with id ${query.id} not found`,
      );

    return user;
  }
}
