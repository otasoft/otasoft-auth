import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordUtilsService {
  constructor(private readonly configService: ConfigService) {}
  /**
   * Method that hashes the password with salt provided as parameter.
   * Uses `bcrypt.hash()` method with password and salt as parameters. 
   * Also, adds `HASH_PEPPER` environment variable to password.
   * @param {string} [password]
   * @param {string} [salt]
   * @return {*}  {String}
   * @memberof PasswordUtilsService
   */
  async hashPassword(
    password: string,
    salt: string
  ): Promise<string> {
    return await bcrypt.hash(
      password + this.configService.get<string>('HASH_PEPPER'),
      salt,
    );
  }

  /**
   * Method that generates `salt` that can be added to the password when signing up.
   * Uses `bcrypt.getSalt()` method and returns a string salt.
   * @return {*}  {String}
   * @memberof PasswordUtilsService
   */
  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  /**
   * Method that checks whether provided password matches user password from database.
   * Uses `bcrypt.compare()` method that returns true when two passwords match.
   * Also, adds `HASH_PEPPER` environment variable to password.
   * @param {string} [providedPassword]
   * @param {string} [userPassword]
   * @return {Boolean}  {Boolean}
   * @memberof PasswordUtilsService
   */
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
