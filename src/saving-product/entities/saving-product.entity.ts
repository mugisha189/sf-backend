import { IsEnum } from "class-validator";
import { CHARGE_TYPE } from "src/constants/constants";
import { PartnerCompany } from "src/partner-company/entities/partner-company.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntryPoint } from "./entry-points.entity";

@Entity()
export class SavingProduct {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: "varchar" })
    savingProductName: string;

    @ManyToOne(() => PartnerCompany, { nullable: false, onDelete: 'CASCADE' })
    company: PartnerCompany;

    @Column({ type: "varchar" })
    productDescription: string;

    @Column({ type: "varchar" })
    productLogo: string;

    @Column({ type: 'enum', enum: CHARGE_TYPE })
    @IsEnum(CHARGE_TYPE, { message: 'Charge type must be either PERCENTAGE or FIXED' })
    cashBackChargeType: CHARGE_TYPE;

    @Column({ type: "int" })
    cashBackChargeValue: number;

    @Column({ type: "int" })
    cashBackMinimumCash: number;

    @Column({ type: "int" })
    cashBackMaximumCash: number;

    @OneToMany(() => EntryPoint, (entryPoint) => entryPoint.product)
    entryPoints: EntryPoint[];

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    constructor(partial: Partial<SavingProduct>) {
        Object.assign(this, partial);
    }
}