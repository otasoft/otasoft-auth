import { Module } from '@nestjs/common';
import { FacebookAuthController } from './facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth.service';

@Module({
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService]
})
export class FacebookAuthModule {}
