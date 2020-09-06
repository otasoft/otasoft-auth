import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class LocalUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        const result = await bcrypt.compare(password, this.password);
        return result;
    }
}