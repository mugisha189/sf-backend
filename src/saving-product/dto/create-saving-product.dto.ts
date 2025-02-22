import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsEnum,
    IsNotEmpty,
    IsPositive,
    IsString,
    IsUUID,
    ValidateNested,
    IsArray,
    IsOptional
} from "class-validator";
import { CHARGE_TYPE, ENTRY_POINT_TYPE } from "src/constants/constants";

// DTO for EntryPoint creation
class CreateEntryPointDto {
    @IsNotEmpty()
    @IsEnum(ENTRY_POINT_TYPE, { message: "Entry point type must be a valid ENUM value" })
    @ApiProperty()
    type: ENTRY_POINT_TYPE;

    @IsNotEmpty()
    @IsPositive()
    @Transform(({ value }) => parseFloat(value)) // Convert to number
    @ApiProperty()
    value: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    productId: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    id?: string;
}

export class CreateSavingProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    savingProductName: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    companyId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    productDescription: string;

    @IsNotEmpty()
    @IsEnum(CHARGE_TYPE, { message: "Charge type must be either PERCENTAGE or FIXED" })
    @ApiProperty()
    cashBackChargeType: CHARGE_TYPE;

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value)) // Convert to number
    @ApiProperty()
    cashBackChargeValue: number;

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value)) // Convert to number
    @ApiProperty()
    cashBackMinimumCash: number;

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value)) 
    @ApiProperty()
    cashBackMaximumCash: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateEntryPointDto)
    @Transform(({ value }) => {
        if (typeof value === "string") {
            return JSON.parse(value); 
        }
        return value;
    })
    @ApiProperty({ type: [CreateEntryPointDto] })
    entryPoints: CreateEntryPointDto[];

    @IsOptional()
    @ApiProperty({ type: "string", format: "binary" })
    productLogo?: Express.Multer.File;
}
