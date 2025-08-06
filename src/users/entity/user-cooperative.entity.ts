import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserCooperativeRole } from '../enum/user-cooperative-role.enum';
import { UserCooperativeStatus } from '../enum/user-cooperative-status.enum';

@Entity()
@Unique(['user', 'cooperative'])
export class UserCooperative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCooperatives, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Cooperative, (coop) => coop.userCooperatives, {
    onDelete: 'CASCADE',
  })
  cooperative: Cooperative;

  @Column({
    type: 'enum',
    enum: Object.values(UserCooperativeRole),
    default: UserCooperativeRole.MEMBER,
  })
  @IsEnum(UserCooperativeRole, {
    message: 'role must be PRESIDENT or MEMBER',
  })
  @IsNotEmpty()
  role: UserCooperativeRole;

  @Column({
    type: 'enum',
    enum: Object.values(UserCooperativeStatus),
    default: UserCooperativeStatus.ACTIVE,
  })
  @IsEnum(UserCooperativeStatus, {
    message: 'status must be ACTIVE or INACTIVE',
  })
  @IsNotEmpty()
  status: UserCooperativeStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
