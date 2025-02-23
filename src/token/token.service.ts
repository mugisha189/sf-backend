import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { Token } from "./entity/token.entity";
import { Repository } from "typeorm";
import { createtokenDto } from "./dto/createToken.dto";

@Injectable()

export class TokenService {
    constructor(
        @InjectRepository(Token) private tokenRepo: Repository<Token>
    ) { }

    async createtoken(createtokenDto: createtokenDto) {
        try {
            // Create a new confirmation token
            const token = new Token()
            token.token = createtokenDto.token
            token.userId = createtokenDto.userId

            // Return the saved token
            return await this.tokenRepo.save(token)
        } catch (error) {
            throw error
        }
    }

    async findOneByUserId(userId: string) {
        try {
            // Check if token exists and return it
            const token = await this.tokenRepo.findOneBy({ userId })
            if (!token) throw new NotFoundException("Confirmation token not found");

            // Return the token
            return token
        } catch (error) {
            throw error
        }
    }


    async findOneByToken(token: string) {
        try {
            const tk = await this.tokenRepo.findOneBy({ token })
            if (!tk) throw new NotFoundException("Confirmation token not found");

            // Return the token
            return tk
        } catch (error) {
            throw error
        }
    }



    async deleteToken(userId: string): Promise<Boolean> {
        try {
            // Check if token exists
            const token = await this.tokenRepo.findOneBy({ userId })
            if (!token) throw new NotFoundException("Confirmation token not found");

            // Now delete the token
            const result = await this.tokenRepo.delete({ userId })

            // Return true or false for the deletion
            return result.affected !== 0
        } catch (error) {
            throw error
        }
    }

}