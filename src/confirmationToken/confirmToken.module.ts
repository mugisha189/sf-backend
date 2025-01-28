import { Module } from "@nestjs/common";
import { ConfirmationTokenService } from "./confirmToken.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfirmationToken } from "./entity/token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ConfirmationToken])],
    providers: [ConfirmationTokenService],
    exports: [ConfirmationTokenService]
})

export class ConfirmationTokenModule{}