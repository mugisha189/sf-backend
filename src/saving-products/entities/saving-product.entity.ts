import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { SavingProductStatus } from '../enums/saving-product-status.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { SubSavingProduct } from './sub-saving-product.entity';
import { SavingProductType } from '../enums/saving-product-type.enum';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';

@Entity()
export class SavingProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    default: 0,
  })
  serviceProviderDividend?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  sfDividend: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  savingInstitutionDividend: number;

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

  @ManyToOne(() => ServiceProvider, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  serviceProvider?: ServiceProvider;

  @OneToMany(() => SubSavingProduct, (subProduct) => subProduct.savingProduct, {
    cascade: true,
  })
  subSavingProducts?: SubSavingProduct[];

  @Column({
    type: 'enum',
    enum: Object.values(SavingProductStatus),
    default: SavingProductStatus.ACTIVE,
  })
  @IsEnum(SavingProductStatus)
  status: SavingProductStatus;

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

  constructor(partial: Partial<SavingProduct>) {
    Object.assign(this, partial);
  }
}
