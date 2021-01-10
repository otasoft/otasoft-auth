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
  @Exclude()
  jwt_payload: string;

  @Column()
  @Exclude()
  is_confirmed: boolean;

  @Column({ nullable: true })
  @Exclude()
  forgotPasswordToken?: string;
}
