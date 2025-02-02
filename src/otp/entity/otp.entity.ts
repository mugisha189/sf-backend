import { OTP_CODE_STATUS } from "src/constants/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity()
export class OtpEntity {

    @PrimaryGeneratedColumn('uuid')
    otpId: UUID

    @Column({type: 'int'})
    otpCode: number

    @Column({type: 'varchar', unique: true})
    email: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    expiresAt: Date

    @Column({type: 'enum', enum: Object.values(OTP_CODE_STATUS), default: OTP_CODE_STATUS.AVAILABLE})
    otpStatus: OTPCodeStatus

    @CreateDateColumn({type: "timestamptz"})
    createdAt: Date

}

type OTPCodeStatus = keyof typeof OTP_CODE_STATUS; // "AVAILABLE" | "USED"
