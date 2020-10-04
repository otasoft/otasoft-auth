import { InternalServerErrorException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from "./user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { IAuthObject } from "../interfaces/auth-object.interface";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<IAuthObject> {
        const { email, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const user = new UserEntity();
        user.email = email;
        user.password = await this.hashPassword(password, salt);
        user.is_confirmed = false;

        try {
            await user.save();
            const token = jwt.sign({ userId: user.id, userEmail: user.email }, process.env.EMAIL_SECRET, { expiresIn: '2d' });
            return {
                auth_id: user.id,
                token: token
            };
        } catch(error) {
            const conflictExceptionCode = '23505';
            if(error.code === conflictExceptionCode) {
                throw new RpcException('Email already registered');
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