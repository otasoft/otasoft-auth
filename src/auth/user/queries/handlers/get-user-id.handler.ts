import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUserIdQuery } from '../impl';
import { UserRepository } from '../../../../db/repositories';
import { RpcExceptionService } from '../../../../utils/exception-handling';

@QueryHandler(GetUserIdQuery)
export class GetUserIdHandler implements IQueryHandler<GetUserIdQuery> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(query: GetUserIdQuery) {
    const user = await this.userRepository.findOne({
      where: { jwt_payload: query.getUserIdDto.payload },
    });

    if (!user) this.rpcExceptionService.throwNotFound('User does not exist')

    return { auth_id: user.id };
  }
}
