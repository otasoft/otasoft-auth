import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from '../../../../db/repositories';
import { ErrorValidationService } from '../../../../utils/error-validation';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { RemoveRefreshTokenCommand } from '../impl';

@CommandHandler(RemoveRefreshTokenCommand)
export class RemoveRefreshTokenHandler
  implements ICommandHandler<RemoveRefreshTokenCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepostory: UserRepository,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly errorValidationService: ErrorValidationService,
  ) {}

  async execute(command: RemoveRefreshTokenCommand): Promise<void> {
    try {
      this.userRepostory.update(command.userId, { hashedRefreshToken: null });
    } catch (error) {
      const errorObject = this.errorValidationService.validateDbError(error);

      this.rpcExceptionService.throwCatchedException(errorObject);
    }
  }
}
