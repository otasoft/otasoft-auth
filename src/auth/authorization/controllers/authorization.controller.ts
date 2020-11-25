import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEntity } from 'src/db/entities';

import { AuthCredentialsDto } from '../../authentication/dto';
import { AccessControlDto, JwtAuthDto } from '../dto';
import { AuthorizationService } from '../services/authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @MessagePattern({ role: 'authorization', cmd: 'checkAccess' })
  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    return this.authorizationService.checkAccessControl(accessControlDto);
  }

  @MessagePattern({ role: 'authorization', cmd: 'getCookieWithJwtAccessToken' })
  getCookieWithJwtAccessToken(id: number): string {
    return this.authorizationService.getCookieWithJwtAccessToken(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern({ role: 'authorization', cmd: 'getAuthenticatedUser' })
  getAuthenticatedUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserEntity> {
    return this.authorizationService.getAuthenticatedUser(authCredentialsDto);
  }
}
