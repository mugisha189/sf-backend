import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/constants/role.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  nationalId: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Object.values(UserRole) })
  @IsEnum(UserRole, {
    message: 'role must be SUPER_ADMIN, COMPANY_ADMIN, or SUBSCRIBER',
  })
  @IsNotEmpty()
  role: UserRole;

  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => ServiceProvider, (company) => company.admin)
  serviceProvider: ServiceProvider;

  @OneToOne(() => SavingInstitution, (company) => company.admin)
  savingInstitution: SavingInstitution;

  @OneToMany(() => UserSubscription, (sub) => sub.user)
  subscriptions: UserSubscription[];

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(newUser: Partial<User>) {
    Object.assign(this, newUser);
  }
}
