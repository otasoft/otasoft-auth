import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { PasswordUtilsService } from '../../../../utils/password-utils';
import { UserReadRepository } from '../../../../db/repositories';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { GetRefreshUserQuery } from '../impl';
import { UserEntity } from '../../../../db/entities';

@QueryHandler(GetRefreshUserQuery)
export class GetRefreshUserHandler
  implements IQueryHandler<GetRefreshUserQuery> {
  constructor(
    @InjectRepository(UserReadRepository)
    private readonly userReadRepository: UserReadRepository,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(query: GetRefreshUserQuery): Promise<UserEntity> {
    const user = await this.userReadRepository.findOne(
      query.getRefreshUserDto.id,
    );

    const isRefreshTokenMatching = await this.passwordUtilsService.compareContent(
      query.getRefreshUserDto.refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenMatching)
      this.rpcExceptionService.throwUnauthorised('Refresh token has expired');

    return user;
  }
}
