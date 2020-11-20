import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AccessControlDto, JwtAuthDto } from '../dto';
import { AccessService } from '../services/access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

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
