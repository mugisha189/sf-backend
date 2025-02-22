import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "src/constants/role.enum";
import { PartnerCompany } from "src/partner-company/entities/partner-company.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50 })
    firstName: string

    @Column({ type: 'varchar', length: 50 })
    lastName: string


    @Column({ type: 'varchar', unique: true })
    nationalId: string

    @Column({ type: 'varchar', unique: true })
    email: string

    @Column({ type: 'varchar' })
    phoneNumber: string


    @Column({ type: 'enum', enum: Object.values(UserRole) })
    @IsEnum(UserRole, { message: 'role must be SUPER_ADMIN, COMPANY_ADMIN, or SUBSCRIBER' })
    @IsNotEmpty()
    role: UserRole;

    @Column({ type: 'varchar' })
    password: string


    @OneToOne(() => PartnerCompany, (company) => company.companyAdmin)
    partnerCompany: PartnerCompany;

    @Column({ type: 'boolean', default: false })
    deleted: boolean

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    constructor(newUser: Partial<Users>) {
        Object.assign(this, newUser)
    }
}