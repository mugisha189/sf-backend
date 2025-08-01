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
import { SavingProductStatus } from '../enums/saving-product-status.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { ServiceProviderProduct } from 'src/service-provider-products/entities/service-provider-product.entity';
@Entity()
export class SavingProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cashBackPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceProviderDividend: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  sfDividend: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  savingProductDividend: number;

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

  @ManyToOne(
    () => ServiceProviderProduct,
    (product) => product.savingProducts,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn()
  serviceProviderProduct: ServiceProviderProduct;

  @Column({
    type: 'enum',
    enum: Object.values(SavingProductStatus),
    default: SavingProductStatus.ACTIVE,
  })
  @IsEnum(SavingProductStatus)
  status: SavingProductStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(partial: Partial<SavingProduct>) {
    Object.assign(this, partial);
  }
}
