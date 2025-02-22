import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { COMPANY_TYPE, PARTNERSHIP_TYPE } from "src/constants/constants";
import { IsEnum } from "class-validator";
import { Users } from "src/users/entity/users.entity";
import { CompanyProduct } from "src/company-products/entities/company-product.entity";


@Entity()
export class PartnerCompany {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    companyAdmin: Users;

    @Column({ type: 'varchar' })
    companyName: string;

    @Column({ type: 'enum', enum: Object.values(COMPANY_TYPE) })
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM, PETROL_STATIONS, or SUPER_MARKET' })
    companyType: COMPANY_TYPE;

    @Column({ type: 'enum', enum: Object.values(PARTNERSHIP_TYPE) })
    @IsEnum(PARTNERSHIP_TYPE)
    partnershipType: PARTNERSHIP_TYPE;

    @OneToMany(() => CompanyProduct, (product) => product.company, { cascade: true })
    products: CompanyProduct[];

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    constructor(partial: Partial<PartnerCompany>) {
        Object.assign(this, partial);
    }
}
