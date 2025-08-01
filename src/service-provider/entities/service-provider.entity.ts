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
import { ServiceProviderStatus } from '../enums/service-provider-status.enum';
import { ServiceProviderCompanyType } from '../enums/service-provider-type.enum';
import { ServiceProviderProduct } from 'src/service-provider-products/entities/service-provider-product.entity';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  admin: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: Object.values(ServiceProviderCompanyType) })
  @IsEnum(ServiceProviderCompanyType, {
    message:
      'Company type must be either TELECOM, PETROL_STATIONS, or SUPER_MARKET',
  })
  type: ServiceProviderCompanyType;

  @OneToMany(() => ServiceProviderProduct, (product) => product.serviceProvider)
  products: ServiceProviderProduct[];

  @Column({
    type: 'enum',
    enum: Object.values(ServiceProviderStatus),
    default: ServiceProviderStatus.ACTIVE,
  })
  @IsEnum(ServiceProviderStatus, {
    message: 'Status of the service',
  })
  status: ServiceProviderStatus;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  constructor(partial: Partial<ServiceProvider>) {
    Object.assign(this, partial);
  }
}
