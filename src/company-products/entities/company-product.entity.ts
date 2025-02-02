import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { COMPANY_TYPE } from "src/constants/constants"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class CompanyProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    companyName: string

    @Column({ type: 'enum', enum: Object.values(COMPANY_TYPE) })
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    companyType: COMPANY_TYPE

    @Column({ type: 'varchar' })
    packageName: string

    @Column({ type: 'int' })
    packageMaximumAmount: number

    @Column({ type: 'varchar' })
    packageDescription: string

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date


    constructor(partial: Partial<CompanyProduct>){
        Object.assign(this,partial)
    }
}
