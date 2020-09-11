import { BaseEntity, Entity, Unique, PrimaryGeneratedColumn, Column } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email'])
export class LocalUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        const result = await bcrypt.compare(password, this.password);
        return result;
    }
}