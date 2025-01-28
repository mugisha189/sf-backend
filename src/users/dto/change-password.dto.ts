import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto{
    @IsString()
    @IsNotEmpty()
    newPassword: string

    @IsString()
    @IsNotEmpty()
    token: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}