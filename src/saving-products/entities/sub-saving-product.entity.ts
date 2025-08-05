import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';
import { SubSavingProductStatus } from '../enums/sub-saving-product-status.enum';
import { IsEnum } from 'class-validator';

@Entity()
export class SubSavingProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(
    () => SavingProduct,
    (savingProduct) => savingProduct.subSavingProducts,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn()
  savingProduct: SavingProduct;

  @Column({
    type: 'enum',
    enum: Object.values(SubSavingProductStatus),
    default: SubSavingProductStatus.ACTIVE,
  })
  @IsEnum(SubSavingProductStatus)
  status: SubSavingProductStatus;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  constructor(partial: Partial<SubSavingProduct>) {
    Object.assign(this, partial);
  }
}
