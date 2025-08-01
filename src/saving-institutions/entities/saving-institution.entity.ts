import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entity/users.entity';
import { SavingInstitutionStatus } from '../enums/saving-institution-status.enum';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';

@Entity()
export class SavingInstitution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  admin: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: Object.values(SavingInstitutionStatus),
    default: SavingInstitutionStatus.ACTIVE,
  })
  @IsEnum(SavingInstitutionStatus, {
    message: 'Status of the service',
  })
  status: SavingInstitutionStatus;

  @OneToMany(
    () => SavingProduct,
    (savingProduct) => savingProduct.savingInstitution,
  )
  savingProducts: SavingProduct[];

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial: Partial<SavingInstitution>) {
    Object.assign(this, partial);
  }
}
