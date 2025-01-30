import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {COMPANY_TYPE} from "src/constants/constants"

@Entity()
export class PartnerCompany {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar'})
    companyName: string

    @Column({type: 'enum', enum:Object.values(COMPANY_TYPE)})
    companyType: keyof typeof COMPANY_TYPE

    @Column({type: "varchar"})
    adminFirstName: string

    @Column({type: "varchar"})
    adminLastName: string

    @Column({type: "varchar"})
    adminPhoneNumber: string

    @Column({type: "varchar"})
    adminEmail: string

    constructor(partial: Partial<PartnerCompany>){
        Object.assign(this, partial)
    }
}
