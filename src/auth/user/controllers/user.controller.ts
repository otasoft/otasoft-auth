import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthConfirmationDto, ChangePasswordDto, GetRefreshUserIdDto, GetUserIdDto} from '../dto';
import { AuthIdModel, StringResponse } from '../models';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'getId' })
  async getUserId(getUserIdDto: GetUserIdDto): Promise<AuthIdModel> {
    return this.userService.getUserId(getUserIdDto);
  }

  @MessagePattern({ role: 'user', cmd: 'getRefreshUserId' })
  async getUserIdIfRefreshTokenMatches(
    getRefreshUserIdDto: GetRefreshUserIdDto
  ): Promise<AuthIdModel> {
    return this.userService.getUserIdIfRefreshTokenMatches(getRefreshUserIdDto);
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
}
