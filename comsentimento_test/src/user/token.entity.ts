import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    expired_at: Date;
}
