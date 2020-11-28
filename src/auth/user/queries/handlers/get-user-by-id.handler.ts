import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities';
import { UserRepository } from 'src/db/repositories';
import { RpcExceptionService } from 'src/utils/exception-handling';
import { GetUserByIdQuery } from '../impl';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    const user = await this.userRepository.findOne(query.id);

    if (!user)
      this.rpcExceptionService.throwNotFound(
        `User with id ${query.id} not found`,
      );

    return user;
  }
}
