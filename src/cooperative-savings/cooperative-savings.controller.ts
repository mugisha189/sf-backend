import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsCoopPresidentGuard } from 'src/guards/isCooperativePresident.guard';
import { CoopSavingsService } from './cooperative-savings.service';
import { CreateCooperativeSavingsDto } from './dto/create-cooperative-saving.dto';
import { User } from 'src/users/entity/users.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Cooperative_Contribution')
@UseGuards(AuthGuard, IsCoopPresidentGuard)
@Controller('cooperative-savings')
export class CoopSavingsController {
  constructor(private readonly cooperativeSavingsService: CoopSavingsService) {}
  // src/contributions/contributions.controller.ts

  @Post('/:coopId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit my cooperative contribution' })
  async saveContribution(
    @Param('id') coopId: string,
    @Body() dto: CreateCooperativeSavingsDto,
    @Req() req: any,
  ) {
    const user = req.user as User;
    return this.cooperativeSavingsService.saveContribution(coopId, user, dto);
  }

  @Get('/:coopId/my')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Retrieve all my cooperative contribution' })
  async getMySavings(@Param('coopId') coopId: string, @Req() req: any) {
    const user = req.user;
    return this.cooperativeSavingsService.getMyCooperativeSavings(coopId, user);
  }
}
