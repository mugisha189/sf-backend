// src/contributions/entities/cooperative-contribution.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { User } from 'src/users/entity/users.entity';

@Entity()
export class CooperativeSavings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cooperative, { onDelete: 'CASCADE' })
  cooperative: Cooperative;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  madeBy: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
