import { CHARGE_TYPE } from "src/constants/constants";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SavingProduct {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column({type: "varchar"})
    savingProductName: string

    @Column({type: "varchar"})
    companyName: string


    @Column({type: "varchar"})
    productDescription: string

    @Column({type: 'enum', enum: Object.values(CHARGE_TYPE)})
    cashBackChargeType: typeof CHARGE_TYPE

    @Column({type: "int"})
    cashBackChargeValue: number

    @Column({type: "int"})
    cashBackMinimumCash: number

    @Column({type: "int"})
    cashBackMaximumCash: number

    @Column({type: "int"})
    entryPointName: number

    @Column({type: 'enum', enum: Object.values(CHARGE_TYPE)})
    entryPointChargeType: typeof CHARGE_TYPE
    rgeValue: number

    @Column({type: "int"})
    entryPointChargeValue: number

    constructor(partial: Partial<SavingProduct>){
        Object.assign(this, partial)
    }
}
