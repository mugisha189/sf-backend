import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from 'src/users/entity/users.entity';
import { ServiceProviderStatus } from '../enums/service-provider-status.enum';
import { ServiceProviderCompanyType } from '../enums/service-provider-type.enum';
import { getManager } from 'typeorm';

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  code: number;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  admin: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: Object.values(ServiceProviderCompanyType) })
  @IsEnum(ServiceProviderCompanyType, {
    message: 'Company type must be either TELECOM, PETROL_STATIONS, or SHOP',
  })
  type: ServiceProviderCompanyType;

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

  @BeforeInsert()
  async generateCode() {
    const result: { max: string | null } | undefined = await getManager()
      .createQueryBuilder(ServiceProvider, 'sp')
      .select('MAX(sp.code)', 'max')
      .getRawOne();

    const maxCode = result?.max ? parseInt(result.max, 10) : 0;
    this.code = maxCode + 1;
  }
}
