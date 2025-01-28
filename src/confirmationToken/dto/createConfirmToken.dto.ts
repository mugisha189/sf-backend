import { IsNotEmpty, IsString } from "class-validator";

export class createConfirmTokenDto{
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}