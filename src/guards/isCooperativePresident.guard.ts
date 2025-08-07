import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { Repository } from 'typeorm';
import { UserCooperativeRole } from 'src/users/enum/user-cooperative-role.enum';

@Injectable()
export class IsCoopPresidentGuard implements CanActivate {
  constructor(
    @InjectRepository(UserCooperative)
    private readonly userCoopRepo: Repository<UserCooperative>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // comes from auth middleware
    const coopId = request.params.id;

    const membership = await this.userCoopRepo.findOne({
      where: {
        user: { id: user.id },
        cooperative: { id: coopId },
      },
      relations: ['user', 'cooperative'],
    });

    if (!membership || membership.role !== UserCooperativeRole.PRESIDENT) {
      throw new ForbiddenException(
        'Only the cooperative president can perform this action.',
      );
    }

    return true;
  }
}
