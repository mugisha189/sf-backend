import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPWordDto{
    @IsString()
    @IsNotEmpty()
    email: string
}