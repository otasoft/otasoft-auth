import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const jwtModuleOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION_TIME'),
      }
    })
  }