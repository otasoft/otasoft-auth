import { Module } from '@nestjs/common';
import { PasswordUtilsService } from './password-utils.service';

@Module({
    providers: [PasswordUtilsService]
})
export class UtilsModule {}
