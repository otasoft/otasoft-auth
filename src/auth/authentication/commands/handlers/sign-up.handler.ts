import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserWriteRepository } from '../../../../db/repositories';
import { SignUpCommand } from '../impl';
import { PasswordUtilsService } from '../../../../utils/password-utils';
import { RpcExceptionService } from '../../../../utils/exception-handling';
import { ErrorValidationService } from '../../../../utils/error-validation';
import { JwtTokenService } from '../../../passport-jwt/services';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @InjectRepository(UserWriteRepository)
    private readonly userWriteRepository: UserWriteRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly rpcExceptionService: RpcExceptionService,
    private readonly errorValidationService: ErrorValidationService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: SignUpCommand) {
    const salt = await this.passwordUtilsService.generateSalt();
    const user = this.userWriteRepository.create();
    user.email = command.authCredentials.email;
    user.password = await this.passwordUtilsService.hashPassword(
      command.authCredentials.password,
      salt,
    );
    user.is_confirmed = false;
    user.jwt_payload = uuidv4();

    try {
      await user.save();
      const token = this.jwtTokenService.signWithSecret(
        { userId: user.id, userEmail: user.email },
        { expiresIn: '2d' },
      );

      return {
        auth_id: user.id,
        token: token,
      };
    } catch (error) {
      const errorObject = this.errorValidationService.validateDbError(
        error.code,
      );

      this.rpcExceptionService.throwCatchedException(errorObject);
    }
  }
}
