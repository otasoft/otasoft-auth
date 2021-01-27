import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthorizationService } from './authorization.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';
import { TokenService } from './token.service';
import { CookieService } from '../../authentication/services';
import { UtilsModule } from '../../../utils/utils.module';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule, UtilsModule],
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

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
