import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccessControlDto } from 'src/auth/dto/access-control.dto';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';
import { AccessService } from 'src/auth/services/access/access.service';

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
