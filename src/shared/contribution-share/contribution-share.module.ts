import { Module } from '@nestjs/common';
import { ContributionShareService } from './contribution-share.service';

@Module({
  providers: [ContributionShareService],
  exports: [ContributionShareService],
})
export class ContributionShareModule {}
