import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import {COMPANY_TYPE} from "src/constants/constants"
import { IsEnum } from "class-validator";

@Entity()
export class PartnerCompany {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid', unique: true})
    companyAdminId: string;

    @Column({type: 'varchar'})
    companyName: string

    @Column({type: 'enum', enum:Object.values(COMPANY_TYPE)})
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    companyType: COMPANY_TYPE

    @Column({type: "varchar"})
    adminFirstName: string

    @Column({type: "varchar"})
    adminLastName: string

    @Column({type: "varchar"})
    adminPhoneNumber: string

    @Column({type: "varchar"})
    adminEmail: string

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date

    constructor(partial: Partial<PartnerCompany>){
        Object.assign(this, partial)
    }
}
