import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class SetPasswordDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string



    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

}
