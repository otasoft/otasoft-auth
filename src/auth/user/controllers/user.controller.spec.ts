import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../services/user.service';
import { UserController } from './user.controller';
import { RpcExceptionService } from '../../../utils/exception-handling';
import { mockedConfigService, mockedJwtService } from '../../../utils/mocks';
import { PasswordUtilsService } from '../../../utils/password-utils';
import { TokenService } from '../../authorization/services';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [UserController],
      providers: [
        UserService,
        RpcExceptionService,
        PasswordUtilsService,
        TokenService,
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

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
