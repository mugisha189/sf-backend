import { ApiAcceptedResponse, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { UserRole } from "src/constants/role.enum";

const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;


export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MinLength(2, { message: "First name must have atleast 2 characters." })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @MinLength(2, { message: "Last name must have atleast 2 characters." })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nationalId: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phoneNumber: string

    @ApiProperty()
    @IsEnum(UserRole, { message: 'role must be one of SUPER_ADMIN, COMPANY_ADMIN, or SUBSCRIBER' })
    @IsNotEmpty()
    role: UserRole

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    // @Matches(passwordRegEx, {
    //     message: `Password must contain Minimum 8 and maximum 20 characters, 
    // at least one uppercase letter, 
    // one lowercase letter, 
    // one number and 
    // one special character`,
    // })
    password: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    // @Matches(passwordRegEx, {
    //     message: `Password must contain Minimum 8 and maximum 20 characters, 
    // at least one uppercase letter, 
    // one lowercase letter, 
    // one number and 
    // one special character`,
    // })
    confirmPassword: string
}