import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({type: 'varchar', length: 50})
    firstName: string

    @Column({type: 'varchar', length: 50})
    lastName: string


    @Column({type: 'varchar', unique: true})
    nationalId: string

    @Column({type: 'varchar', unique: true})
    email: string

    @Column({type: 'varchar'})
    phoneNumber: string

    @Column({type: 'varchar'})
    password: string

    @UpdateDateColumn({type:'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date

    @CreateDateColumn({type:'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt:Date
}