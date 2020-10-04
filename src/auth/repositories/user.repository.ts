import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}