import { Module } from '@nestjs/common';

import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { PassportJwtModule } from './passport-jwt/passport-jwt.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PassportJwtModule,
    AuthenticationModule,
    AuthorizationModule,
    UserModule,
  ],
})
export class AuthModule {}
