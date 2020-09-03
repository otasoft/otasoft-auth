import { UserEntity } from "./user.entity";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const user = new UserEntity();
        user.username = username;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
        } catch(error) {
            if(error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if(user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}