import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PasswordUtilsService } from './password-utils';

@Module({
  imports: [ConfigModule],
  providers: [PasswordUtilsService],
  exports: [PasswordUtilsService],
})
export class UtilsModule {}
