import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PasswordUtilsService } from './password-utils.service';

@Module({
  imports: [ConfigModule],
  providers: [PasswordUtilsService],
})
export class UtilsModule {}
