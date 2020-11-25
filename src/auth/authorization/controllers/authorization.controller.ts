import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { AuthorizationService } from '../services/authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @MessagePattern({ role: 'authorization', cmd: 'checkJwt' })
  validateToken(jwtDataObject: JwtAuthDto): boolean {
    return this.authorizationService.validateToken(jwtDataObject);
  }

  @MessagePattern({ role: 'authorization', cmd: 'checkAccess' })
  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    return this.authorizationService.checkAccessControl(accessControlDto);
  }

  @MessagePattern({ role: 'authorization', cmd: 'getCookieWithJwtAccessToken' })
  getCookieWithJwtAccessToken(
    id: number,
  ): string {
    return this.authorizationService.getCookieWithJwtAccessToken(id);
  }
}
