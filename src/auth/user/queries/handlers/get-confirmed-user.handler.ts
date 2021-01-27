import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { IConfirmedAccountObject } from '../../interfaces';
import { UserReadRepository } from '../../../../db/repositories';
import { GetConfirmedUserQuery } from '../impl';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { TokenService } from '../../../authorization/services';

@QueryHandler(GetConfirmedUserQuery)
export class GetConfirmedUserHandler
  implements IQueryHandler<GetConfirmedUserQuery> {
  constructor(
    @InjectRepository(UserReadRepository)
    private readonly userReadRepository: UserReadRepository,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    query: GetConfirmedUserQuery,
  ): Promise<IConfirmedAccountObject> {
    const { token } = query.authConfirmationDto;
    const dataObjectFromToken = this.tokenService.verifyToken(token);
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
