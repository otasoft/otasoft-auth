import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtTokenService } from '../../passport-jwt/services';
import { UserService } from '../../user/services/user.service';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';
import { AuthenticationService } from './authentication.service';
import { RpcExceptionService } from '../../../utils/exception-handling';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        AuthenticationService,
        UserService,
        JwtTokenService,
        RpcExceptionService,
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

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
