import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class CompanyProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    companyName: string

    @Column({ type: 'varchar' })
    packageName: string

    @Column({ type: 'int' })
    packageMaximumAmount: number

    @Column({ type: 'int' })
    packageDescription: number

    constructor(partial: Partial<CompanyProduct>){
        Object.assign(this,partial)
    }
}
