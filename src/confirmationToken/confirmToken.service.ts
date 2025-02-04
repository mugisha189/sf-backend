import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { ConfirmationToken } from "./entity/token.entity";
import { Repository } from "typeorm";
import { createConfirmTokenDto } from "./dto/createConfirmToken.dto";

@Injectable()

export class ConfirmationTokenService {
    constructor(
        @InjectRepository(ConfirmationToken) private confirmTokenRepo: Repository<ConfirmationToken>
    ) { }

    async createConfirmToken(createConfirmTokenDto: createConfirmTokenDto) {
        try {
            // Create a new confirmation token
            const token = new ConfirmationToken()
            token.token = createConfirmTokenDto.token
            token.userId = createConfirmTokenDto.userId

            // Return the saved token
            return await this.confirmTokenRepo.save(token)
        } catch (error) {
            throw error
        }
    }

    async findOneByUserId(userId: string) {
        try {
            // Check if token exists and return it
            const token = await this.confirmTokenRepo.findOneBy({ userId })
            if (!token) throw new NotFoundException("Confirmation token not found");
            
            // Return the token
            return token
        } catch (error) {
            throw error
        }
    }


    async deleteToken(userId: string): Promise<Boolean> {
        try {
            // Check if token exists
            const token = await this.confirmTokenRepo.findOneBy({ userId })
            if (!token) throw new NotFoundException("Confirmation token not found");

            // Now delete the token
            const result = await this.confirmTokenRepo.delete({ userId })
            
            // Return true or false for the deletion
            return result.affected !== 0
        } catch (error) {
            throw error
        }
    }

}