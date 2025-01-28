import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;


export class UpdateUserDto {
    @IsString()
    @MinLength(2, { message: "First name must have atleast 2 characters." })
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @MinLength(2, { message: "Last name must have atleast 2 characters." })
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    nationalId: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: `Password must contain Minimum 8 and maximum 20 characters, 
    at least one uppercase letter, 
    one lowercase letter, 
    one number and 
    one special character`,
    })
    password: string
}