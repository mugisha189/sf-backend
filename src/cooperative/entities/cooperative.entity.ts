import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { CooperativeStatus } from '../enums/cooperative-status.enum';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';

@Entity()
export class Cooperative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  province: string;

  @Column({ type: 'varchar' })
  district: string;

  @Column({ type: 'varchar' })
  sector: string;

  @Column({ type: 'varchar' })
  cell: string;

  @Column({ type: 'varchar' })
  village: string;

  @Column({
    type: 'enum',
    enum: Object.values(CooperativeStatus),
    default: CooperativeStatus.ACTIVE,
  })
  @IsEnum(CooperativeStatus, {
    message: 'Status of the service',
  })
  status: CooperativeStatus;

  @OneToMany(() => UserCooperative, (uc) => uc.cooperative)
  userCooperatives: UserCooperative[];

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial: Partial<Cooperative>) {
    Object.assign(this, partial);
  }
}
