import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { SignInCommand } from '../../impl';
import { UserRepository } from '../../../../db/repositories';
import { IJwtPayload } from '../../../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { PasswordUtilsService } from 'src/utils/password-utils';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordUtilsService: PasswordUtilsService,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: SignInCommand) {
    const user = await this.userRepository.findOne({
      email: command.authCredentials.email,
    });

    if (!user)
      throw new RpcException({
        statusCode: 404,
        errorStatus: 'User not found',
      });

    if (
      await this.passwordUtilsService.validatePassword(
        command.authCredentials.password,
        user.password,
      )
    ) {
      try {
        const jwtPayload = uuidv4();
        user.jwt_payload = jwtPayload;
        user.save();

        const payload: IJwtPayload = { jwt_payload: jwtPayload };
        const accessToken: string = await this.jwtService.sign(payload);

        return { accessToken };
      } catch (error) {
        throw new RpcException({
          statusCode: 401,
          errorStatus: 'Cannot sign in',
        });
      }
    } else {
      throw new RpcException({
        statusCode: 401,
        errorStatus: 'Invalid credentials',
      });
    }
  }
}
