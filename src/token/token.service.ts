import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { Repository } from 'typeorm';
import { createtokenDto } from './dto/createToken.dto';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(Token) private tokenRepo: Repository<Token>) {}

  async createtoken(createtokenDto: createtokenDto) {
    // Create a new confirmation token
    const token = new Token();
    token.token = createtokenDto.token;
    token.userId = createtokenDto.userId;

    // Return the saved token
    return await this.tokenRepo.save(token);
  }

  async findOneByUserId(userId: string) {
    // Check if token exists and return it
    const token = await this.tokenRepo.findOneBy({ userId });
    if (!token) throw new NotFoundException('Confirmation token not found');

    // Return the token
    return token;
  }

  async findOneByToken(token: string) {
    const tk = await this.tokenRepo.findOneBy({ token });
    if (!tk) throw new NotFoundException('Confirmation token not found');

    // Return the token
    return tk;
  }

  async deleteToken(userId: string): Promise<boolean> {
    // Check if token exists
    const token = await this.tokenRepo.findOneBy({ userId });
    if (!token) throw new NotFoundException('Confirmation token not found');

    // Now delete the token
    const result = await this.tokenRepo.delete({ userId });

    // Return true or false for the deletion
    return result.affected !== 0;
  }
}
