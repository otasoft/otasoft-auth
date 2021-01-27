import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { TokenService } from './token.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
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

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
