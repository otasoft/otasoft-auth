import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../../db/entities';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
