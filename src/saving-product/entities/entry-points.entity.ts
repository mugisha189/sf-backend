import { IsEnum } from "class-validator";
import { CompanyProduct } from "src/company-products/entities/company-product.entity";
import { ENTRY_POINT_TYPE } from "src/constants/constants";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SavingProduct } from "./saving-product.entity";

@Entity()
export class EntryPoint {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => CompanyProduct, { nullable: false, onDelete: 'CASCADE' })
    product: CompanyProduct;


    @ManyToOne(() => SavingProduct, { nullable: false, onDelete: 'CASCADE' })
    savingProduct: SavingProduct;

    @Column({ type: 'enum', enum: ENTRY_POINT_TYPE })
    @IsEnum(ENTRY_POINT_TYPE)
    type: ENTRY_POINT_TYPE;

    @Column({ type: "int" })
    value: number;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    constructor(partial: Partial<EntryPoint>) {
        Object.assign(this, partial);
    }
}