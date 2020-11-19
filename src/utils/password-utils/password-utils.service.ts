import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordUtilsService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(
      password + this.configService.get<string>('HASH_PEPPER'),
      salt,
    );
  }

  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  async validatePassword(
    providedPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(
      providedPassword + this.configService.get<string>('HASH_PEPPER'),
      userPassword,
    );
  }
}
