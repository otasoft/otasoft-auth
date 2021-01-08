import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthorizationService } from './authorization.service';
import { JwtTokenService } from '../../passport-jwt/services';
import { UserService } from '../../user/services/user.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { PasswordUtilsService } from '../../../utils/password-utils';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
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

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
