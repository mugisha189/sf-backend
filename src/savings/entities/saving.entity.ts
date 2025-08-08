import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { SavingStatus } from '../enums/saving-status.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { User } from 'src/users/entity/users.entity';
import { SavingProductType } from 'src/saving-products/enums/saving-product-type.enum';

@Entity()
export class Saving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(
    () => SavingInstitution,
    (institution) => institution.savingProducts,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn()
  savingInstitution: SavingInstitution;

  @Column({
    type: 'enum',
    enum: Object.values(SavingStatus),
    default: SavingStatus.PENDING,
  })
  @IsEnum(SavingStatus)
  status: SavingStatus;

  @Column({
    type: 'enum',
    enum: Object.values(SavingProductType),
    nullable: true,
  })
  @IsEnum(SavingProductType)
  type: SavingProductType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(partial: Partial<Saving>) {
    Object.assign(this, partial);
  }
}
