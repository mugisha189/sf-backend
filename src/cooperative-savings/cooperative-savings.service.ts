// src/contributions/contributions.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { CooperativeSavings } from './entities/cooperative-saving.entity';
import { User } from 'src/users/entity/users.entity';
import { CreateCooperativeSavingsDto } from './dto/create-cooperative-saving.dto';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { UserCooperativeStatus } from 'src/users/enum/user-cooperative-status.enum';
import { ContributionShareService } from 'src/shared/contribution-share/contribution-share.service';

@Injectable()
export class CoopSavingsService {
  constructor(
    @InjectRepository(Cooperative)
    private readonly coopRepo: Repository<Cooperative>,

    @InjectRepository(CooperativeSavings)
    private readonly coopSavingsRepo: Repository<CooperativeSavings>,

    @InjectRepository(UserCooperative)
    private readonly userCoopRepo: Repository<UserCooperative>,

    private readonly shareService: ContributionShareService,
  ) {}

  async saveContribution(
    coopId: string,
    user: User,
    dto: CreateCooperativeSavingsDto,
  ): Promise<CooperativeSavings> {
    const coop = await this.coopRepo.findOne({ where: { id: coopId } });
    if (!coop) throw new NotFoundException('Cooperative not found.');

    const activeMembers = await this.userCoopRepo.find({
      where: {
        cooperative: { id: coopId },
        status: UserCooperativeStatus.ACTIVE,
      },
      relations: ['user'],
    });

    if (activeMembers.length === 0) {
      throw new BadRequestException('No active members found.');
    }

    const totalConfigured =
      this.shareService.calculateTotalConfigured(activeMembers);
    if (totalConfigured === 0) {
      throw new BadRequestException(
        'Configured contribution amounts are all zero.',
      );
    }

    if (dto.amount < totalConfigured) {
      throw new BadRequestException(
        `Submitted amount (${dto.amount}) is less than expected total (${totalConfigured}).`,
      );
    }

    // Save group contribution
    const contribution = this.coopSavingsRepo.create({
      cooperative: coop,
      madeBy: user,
      amount: dto.amount,
      note: dto.note,
    });

    await this.coopSavingsRepo.save(contribution);

    // Calculate and apply shares
    const shareMap = this.shareService.calculateShares(
      activeMembers,
      totalConfigured,
      dto.amount,
    );

    for (const member of activeMembers) {
      const share = shareMap.get(member.id) || 0;
      member.contributionAmount += share;
      await this.userCoopRepo.save(member);
    }

    return contribution;
  }
  async getMyCooperativeSavings(
    coopId: string,
    user: User,
    page = 1,
    limit = 10,
    // fromDate?: Date,
    // toDate?: Date,
  ) {
    const query = this.coopSavingsRepo
      .createQueryBuilder('savings')
      .where('savings.cooperativeId = :coopId', { coopId })
      .andWhere('savings.madeById = :userId', { userId: user.id })
      .leftJoinAndSelect('savings.cooperative', 'cooperative');

    // // Date range filtering
    // if (fromDate) {
    //   query.andWhere('savings.createdAt >= :fromDate', { fromDate });
    // }
    // if (toDate) {
    //   query.andWhere('savings.createdAt <= :toDate', { toDate });
    // }

    // Get total count
    const total = await query.getCount();

    // Get paginated results
    const data = await query
      .orderBy('savings.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return data;
  }
}
