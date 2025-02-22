import { PartnerCompany } from "src/partner-company/entities/partner-company.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CompanyProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PartnerCompany, (company) => company.products, { nullable: false, onDelete: 'CASCADE' })
    company: PartnerCompany;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'int' })
    maximumAmount: number;

    @Column({ type: 'int' })
    minimumAmount: number;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;


    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    constructor(partial: Partial<CompanyProduct>) {
        Object.assign(this, partial);
    }
}
