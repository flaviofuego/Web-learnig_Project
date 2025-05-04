// src/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Calculation } from './calculation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;
  
  @OneToMany(() => Calculation, calculation => calculation.user)
  calculations: Calculation[];
}