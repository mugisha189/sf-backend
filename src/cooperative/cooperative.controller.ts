import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/constants/role.enum';
import { CooperativeStatus } from './enums/cooperative-status.enum';
import { AddMembersDto } from './dto/add-member.dto';

@Controller('cooperative')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Cooperative')
export class CooperativeController {
  constructor(private readonly cooperativeService: CooperativeService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create cooperative' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCooperativeDto) {
    const result = await this.cooperativeService.create(dto);
    return new CustomApiResponse('Cooperative created successfully.', result);
  }
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'status', enum: CooperativeStatus, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'telecom',
  })
  async findAll(
    @Query('status') status?: CooperativeStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.cooperativeService.findAll(
      status,
      Number(page),
      Number(limit),
      search,
    );
    return new CustomApiResponse('Fetched cooperatives successfully.', result);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const result = await this.cooperativeService.findOne(id);
    return new CustomApiResponse('Fetched cooperative successfully.', result);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateCooperativeDto) {
    const result = await this.cooperativeService.update(id, dto);
    return new CustomApiResponse('Cooperative updated successfully.', result);
  }

  @Put(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    await this.cooperativeService.deactivate(id);
    return new CustomApiResponse('Cooperative deactivated.', true);
  }

  @Put(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    await this.cooperativeService.activate(id);
    return new CustomApiResponse('Cooperative activated.', true);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.cooperativeService.remove(id);
    return new CustomApiResponse('Cooperative deleted successfully.', result);
  }

  @Post(':id/members')
  @Roles(UserRole.SUPER_ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Add multiple members to a cooperative' })
  async addMembers(@Param('id') id: string, @Body() dto: AddMembersDto) {
    const result = await this.cooperativeService.addMembers(id, dto);
    return new CustomApiResponse('Members added successfully.', result);
  }

  @Delete(':coopId/members/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a user from a cooperative' })
  async removeMember(
    @Param('coopId') coopId: string,
    @Param('userId') userId: string,
  ) {
    const result = await this.cooperativeService.removeMember(coopId, userId);
    return new CustomApiResponse('Member removed successfully.', result);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a cooperative' })
  async getMembers(@Param('id') id: string) {
    const result = await this.cooperativeService.getMembers(id);
    return new CustomApiResponse('Fetched cooperative members.', result);
  }
}
