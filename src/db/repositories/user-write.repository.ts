import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UserWriteRepository extends Repository<UserEntity> {}
