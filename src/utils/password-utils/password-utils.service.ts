import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordUtilsService {
  constructor(private readonly configService: ConfigService) {}
  /**
   * Method that hashes the content specified amount of times.
   * Uses `bcrypt.hash()` method that returns hashed content as string.
   * @param {string} [content]
   * @param {number} [rounds]
   * @return {string}  {String}
   * @memberof PasswordUtilsService
   */
  async hashContent(
    contentToHash: string,
    roundsOrSalt: number | string,
  ): Promise<string> {
    return await bcrypt.hash(contentToHash, roundsOrSalt);
  }

  /**
   * Method that compares two bcrypt hashed values.
   * Uses `bcrypt.compare()` method that returns true when two variables are the same.
   * @param {string} [providedContent]
   * @param {number} [userContent]
   * @return {string}  {String}
   * @memberof PasswordUtilsService
   */
  async compareContent(
    providedContent: string,
    userContent: string,
  ): Promise<boolean> {
    return await bcrypt.compare(providedContent, userContent);
  }
  
  /**
   * Method that generates `salt` that can be added to the password when signing up.
   * Uses `bcrypt.genSalt()` method and returns a string salt.
   * @return {*}  {String}
   * @memberof PasswordUtilsService
   */
  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  /**
   * Method that hashes the password with salt provided as parameter.
   * Adds `HASH_PEPPER` environment variable to password for better security.
   * @param {string} [password]
   * @param {string} [salt]
   * @return {*}  {String}
   * @memberof PasswordUtilsService
   */
  async hashPassword(password: string, salt: string): Promise<string> {
    return await this.hashContent(
      password + this.configService.get<string>('HASH_PEPPER'),
      salt,
    );
  }

  /**
   * Method that checks whether provided password matches user password from database.
   * Adds `HASH_PEPPER` environment variable to password.
   * @param {string} [providedPassword]
   * @param {string} [userPassword]
   * @return {Boolean}  {Boolean}
   * @memberof PasswordUtilsService
   */
  async validatePassword(
    providedPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await this.compareContent(
      providedPassword + this.configService.get<string>('HASH_PEPPER'),
      userPassword,
    );
  }
}
