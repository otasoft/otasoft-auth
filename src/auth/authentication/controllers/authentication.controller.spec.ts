import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthenticationController } from './authentication.controller';
import { JwtTokenService } from '../../passport-jwt/services';
import { UserService } from '../../user/services/user.service';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';
import { AuthenticationService } from '../services/authentication.service';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { CqrsModule } from '@nestjs/cqrs';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthenticationController],
      providers:[
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
      ]
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
