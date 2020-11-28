import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ErrorValidationService } from './error-validation';
import { RpcExceptionService } from './exception-handling';
import { PasswordUtilsService } from './password-utils';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PasswordUtilsService,
    RpcExceptionService,
    ErrorValidationService,
  ],
  exports: [PasswordUtilsService, RpcExceptionService, ErrorValidationService],
})
export class UtilsModule {}
