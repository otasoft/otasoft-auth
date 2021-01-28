import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from '../services/authorization.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';
import { TokenService } from '../services';
import { CookieService } from '../../authentication/services';

describe('AuthorizationController', () => {
  let controller: AuthorizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthorizationController],
      providers: [
        AuthorizationService,
        RpcExceptionService,
        TokenService,
        CookieService,
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
