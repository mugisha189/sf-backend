import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyOtpDto{
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNumber()
    @IsNotEmpty()
    otpCode: number
}
