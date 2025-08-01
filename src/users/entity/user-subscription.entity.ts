// user-subscription.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => SavingProduct, { onDelete: 'CASCADE' })
  @JoinColumn()
  savingProduct: SavingProduct;

  @CreateDateColumn()
  subscribedAt: Date;
}
