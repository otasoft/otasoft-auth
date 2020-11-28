import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEntity } from 'src/db/entities';

import {
  AuthConfirmationDto,
  ChangePasswordDto,
  GetRefreshUserDto,
  GetUserIdDto,
} from '../dto';
import { AuthIdModel, StringResponse } from '../models';
import { UserService } from '../services/user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'getId' })
  async getUserId(getUserIdDto: GetUserIdDto): Promise<AuthIdModel> {
    return this.userService.getUserId(getUserIdDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ role: 'user', cmd: 'getUserById' })
  async getUserById(id: number): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @MessagePattern({ role: 'user', cmd: 'getUserIfRefreshTokenMatches' })
  async getUserIfRefreshTokenMatches(
    getRefreshUserIdDto: GetRefreshUserDto,
  ): Promise<UserEntity> {
    return this.userService.getUserIfRefreshTokenMatches(getRefreshUserIdDto);
  }

  @MessagePattern({ role: 'user', cmd: 'changePassword' })
  async changeUserPassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<StringResponse> {
    return this.userService.changeUserPassword(changePasswordDto);
  }

  @MessagePattern({ role: 'user', cmd: 'deleteAccount' })
  async deleteUserAccount(id: number): Promise<StringResponse> {
    return this.userService.deleteUserAccount(id);
  }

  @MessagePattern({ role: 'user', cmd: 'confirmAccount' })
  async confirmAccountCreation(
    authConfirmationDto: AuthConfirmationDto,
  ): Promise<void> {
    return this.userService.confirmAccountCreation(authConfirmationDto);
  }

  @MessagePattern({ role: 'user', cmd: 'removeRefreshToken' })
  async removeRefreshToken(userId: number): Promise<void> {
    return this.userService.removeRefreshToken(userId);
  }
}
