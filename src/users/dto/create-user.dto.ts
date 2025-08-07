import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'First name must have atleast 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Last name must have atleast 2 characters.' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

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
  password: string;

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
  confirmPassword: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'User profile image',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
