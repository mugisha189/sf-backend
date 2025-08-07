import { Injectable } from '@nestjs/common';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';

@Injectable()
export class ContributionShareService {
  /**
   * Calculates total configured contribution from active members
   */
  calculateTotalConfigured(members: UserCooperative[]): number {
    return members.reduce(
      (sum, member) => sum + (member.user.configuredContributionAmount || 0),
      0,
    );
  }

  /**
   * Returns a map of member IDs to their allocated share amount
   */
  calculateShares(
    members: UserCooperative[],
    totalConfigured: number,
    totalAmount: number,
  ): Map<string, number> {
    const shareMap = new Map<string, number>();

    for (const member of members) {
      const configured = member.user.configuredContributionAmount || 0;
      if (configured <= 0) continue;

      const ratio = configured / totalConfigured;
      const share = Math.round(ratio * totalAmount);
      shareMap.set(member.id, share);
    }

    return shareMap;
  }
}
