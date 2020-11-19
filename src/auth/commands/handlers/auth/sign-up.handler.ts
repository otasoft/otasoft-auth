import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { UserRepository } from '../../../repositories/user.repository';
import { SignUpCommand } from '../../impl';
import { PasswordUtilsService } from '../../../../utils/password-utils';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly passwordUtilsService: PasswordUtilsService,
  ) {}

  async execute(command: SignUpCommand) {
    const salt = await this.passwordUtilsService.generateSalt();
    const user = await this.userRepository.create();
    user.email = command.authCredentials.email;
    user.password = await this.passwordUtilsService.hashPassword(
      command.authCredentials.password,
      salt,
    );
    user.is_confirmed = false;
    user.jwt_payload = uuidv4();

    try {
      await user.save();
      const token = jwt.sign(
        { userId: user.id, userEmail: user.email },
        process.env.EMAIL_SECRET,
        { expiresIn: '2d' },
      );
      return {
        auth_id: user.id,
        token: token,
      };
    } catch (error) {
      const conflictExceptionCode = '23505';
      if (error.code === conflictExceptionCode) {
        throw new RpcException('Email already registered');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
