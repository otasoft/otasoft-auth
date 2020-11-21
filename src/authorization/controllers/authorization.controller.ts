import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { AuthorizationService } from '../services/authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly accessService: AuthorizationService) {}

  @MessagePattern({ role: 'auth', cmd: 'checkJwt' })
  validateToken(jwtDataObject: JwtAuthDto): boolean {
    return this.accessService.validateToken(jwtDataObject);
  }

  @MessagePattern({ role: 'auth', cmd: 'checkAccess' })
  async checkAccessControl(
    accessControlDto: AccessControlDto,
  ): Promise<boolean> {
    return this.accessService.checkAccessControl(accessControlDto);
  }
}
