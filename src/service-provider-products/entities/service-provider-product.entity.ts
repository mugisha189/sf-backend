import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ServiceProviderProductStatus } from '../enums/service-provider-product-status.enum';
import { IsEnum } from 'class-validator';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';

@Entity()
export class ServiceProviderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  min: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  max: number;

  @ManyToOne(() => ServiceProvider, (provider) => provider.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  serviceProvider: ServiceProvider;

  @Column({
    type: 'enum',
    enum: Object.values(ServiceProviderProductStatus),
    default: ServiceProviderProductStatus.ACTIVE,
  })
  @IsEnum(ServiceProviderProductStatus, {
    message: 'Status of the service',
  })
  status: ServiceProviderProductStatus;

  @OneToMany(
    () => SavingProduct,
    (savingProduct) => savingProduct.serviceProviderProduct,
  )
  savingProducts: SavingProduct[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(partial: Partial<ServiceProviderProduct>) {
    Object.assign(this, partial);
  }
}
