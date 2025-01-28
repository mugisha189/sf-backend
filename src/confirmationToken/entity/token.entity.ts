import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['createdAt'], {expireAfterSeconds: 600})
export class ConfirmationToken{
    @PrimaryGeneratedColumn('uuid')
    userId: string

    @Column({type: "varchar", unique: true, nullable: false})
    token:string

    @CreateDateColumn({type: "timestamptz", default: ()=> 'CURRENT_TIMESTAMP'})
    createdAt: Date
}