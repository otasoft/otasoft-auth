import { InternalServerErrorException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { LocalUserEntity } from "./local-user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";

@EntityRepository(LocalUserEntity)
export class LocalUserRepository extends Repository<LocalUserEntity> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<number> {
        const { email, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const user = new LocalUserEntity();
        user.email = email;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
            return user.id;
        } catch(error) {
            const conflictExceptionCode = '23505';
            if(error.code === conflictExceptionCode) {
                throw new RpcException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOne({ email });

        if(user && await user.validatePassword(password)) {
            return user.email;
        } else {
            return null;
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}