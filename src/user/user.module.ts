import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from 'src/auth/commands/handlers';
import { jwtModuleOptions } from 'src/auth/jwt/jwt-module-options';
import { JwtStrategy } from 'src/auth/jwt/jwt-strategy';
import { QueryHandlers } from 'src/auth/queries/handlers';
import { UserRepository } from 'src/db/repositories';
import { PasswordUtilsService } from 'src/utils/password-utils';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync(jwtModuleOptions),
        TypeOrmModule.forFeature([UserRepository]),
        CqrsModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        JwtStrategy,
        ConfigService,
        PasswordUtilsService,
        ...QueryHandlers,
        ...CommandHandlers,
    ],
})
export class UserModule {}
