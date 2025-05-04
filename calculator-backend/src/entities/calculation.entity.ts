// src/entities/calculation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('calculations')
export class Calculation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    expression: string;

    @Column()
    result: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ManyToOne(() => User, user => user.calculations)
    @JoinColumn({ name: 'user_id' }) // Especifica explícitamente el nombre de la columna
    user: User;
}