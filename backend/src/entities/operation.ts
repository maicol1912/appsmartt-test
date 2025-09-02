import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Check } from 'typeorm';
import { User } from './user';
import { OperationType } from '../types';

@Entity('operations')
@Check(`"amount" > 0`)
export class Operation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: OperationType,
    })
    type: OperationType;

    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column({ length: 10 })
    currency: string;

    @Column({ name: 'user_id' })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.operations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}