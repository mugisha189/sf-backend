import { IsEnum } from "class-validator";
import { CHARGE_TYPE, COMPANY_TYPE } from "src/constants/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SavingProduct {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column({type: "varchar"})
    savingProductName: string

    @Column({type: "varchar"})
    companyName: string

    @Column({type: "enum", enum: Object.values(COMPANY_TYPE)})
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    companyType: COMPANY_TYPE

    @Column({type: "varchar"})
    productDescription: string

    @Column({type: 'enum', enum: Object.values(CHARGE_TYPE)})
    @IsEnum(CHARGE_TYPE, { message: 'Charge type must be either PERCENTAGE or FIXED' })
    cashBackChargeType:  CHARGE_TYPE

    @Column({type: "int"})
    cashBackChargeValue: number

    @Column({type: "int"})
    cashBackMinimumCash: number

    @Column({type: "int"})
    cashBackMaximumCash: number

    @Column({type: "varchar"})
    entryPointName: string

    @Column({type: 'enum', enum: Object.values(CHARGE_TYPE)})
    @IsEnum(CHARGE_TYPE, { message: 'Charge type must be either PERCENTAGE or FIXED' })
    entryPointChargeType:  CHARGE_TYPE

    @Column({type: "int"})
    entryPointChargeValue: number

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date


    constructor(partial: Partial<SavingProduct>){
        Object.assign(this, partial)
    }
}
