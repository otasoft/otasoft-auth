import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from '../services/authorization.service';
import { JwtTokenService } from '../../passport-jwt/services';
import { UserService } from '../../user/services/user.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { PasswordUtilsService } from '../../../utils/password-utils';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthorizationController],
      providers: [
        AuthorizationService,
        RpcExceptionService,
        UserService,
        JwtTokenService,
        PasswordUtilsService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
