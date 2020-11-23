import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken?: string;

  @Column()
  jwt_payload: string;

  @Column()
  is_confirmed: boolean;
}
