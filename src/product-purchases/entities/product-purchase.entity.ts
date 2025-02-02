import { IsEnum } from "class-validator";
import { COMPANY_TYPE } from "src/constants/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductPurchase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    savingProductName: string

    @Column({ type: "varchar" })
    companyName: string

    @Column({type: "enum", enum: Object.values(COMPANY_TYPE)})
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    companyType: COMPANY_TYPE

    @Column({type: "varchar"})
    product: string

    @Column({type: "int"})
    trxAmount: number

    @Column({type: "int"})
    productAmount: number

    @Column({type: "int"})
    sfAmount: number

    @Column({type: "int"})
    ejoHezaAmount: number

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date


    constructor(partial: Partial<ProductPurchase>){
        Object.assign(this, partial)
    }
}
