import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';

import { IConfirmedAccountObject } from '../../interfaces';
import { UserReadRepository } from '../../../../db/repositories';
import { GetConfirmedUserQuery } from '../impl';
import { RpcExceptionService } from '../../../../utils/exception-handling';

@QueryHandler(GetConfirmedUserQuery)
export class GetConfirmedUserHandler
  implements IQueryHandler<GetConfirmedUserQuery> {
  constructor(
    @InjectRepository(UserReadRepository)
    private readonly userReadRepository: UserReadRepository,
    private readonly rpcExceptionService: RpcExceptionService,
  ) {}

  async execute(
    query: GetConfirmedUserQuery,
  ): Promise<IConfirmedAccountObject> {
    const { token } = query.authConfirmationDto;
    const dataObjectFromToken = jwt.verify(token, process.env.EMAIL_SECRET);
    const { id, email } = <any>dataObjectFromToken;
    const user = await this.userReadRepository.findOne({
      where: { id: id, email: email },
    });

    if (!user) this.rpcExceptionService.throwNotFound('Account not confirmed');

    return {
      isAccountConfirmed: true,
      userId: id,
    };
  }
}
