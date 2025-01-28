import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { ConfirmationToken } from "./entity/token.entity";
import { Repository } from "typeorm";
import {  createConfirmTokenDto } from "./dto/createConfirmToken.dto";

@Injectable()

export class ConfirmationTokenService {
    constructor(
        @InjectRepository(ConfirmationToken) private confirmTokenRepo: Repository<ConfirmationToken>
    ){}

    async createConfirmToken(createConfirmTokenDto: createConfirmTokenDto){
        try {
            const token = new ConfirmationToken()
            token.token = createConfirmTokenDto.token
            token.userId = createConfirmTokenDto.userId

            return await this.confirmTokenRepo.save(token)
        } catch (error) {
            throw error
        }
    }

    async findOneByUserId(userId: string) {
        try {
            const token = await this.confirmTokenRepo.findOneBy({userId})
            if(!token) throw new NotFoundException("Confirmation token not found");

            return token
        } catch (error) {
            throw error
        }
    }


    async deleteToken(userId: string){
        try {
            await this.confirmTokenRepo.delete({userId})
        } catch (error) {
            throw error
        }
    }

}