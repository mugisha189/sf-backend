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
  UseGuards,
  Req,
} from '@nestjs/common';
import { SavingService } from './saving.service';
import { CreateSavingDto } from './dto/create-saving.dto';
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
import { UserRole } from 'src/constants/role.enum';
import { SavingStatus } from './enums/saving-status.enum';
import { Request } from 'express';
import { SavingProductType } from 'src/saving-products/enums/saving-product-type.enum';

@Controller('saving')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Saving')
export class SavingController {
  constructor(private readonly savingService: SavingService) {}

  @Post()
  @ApiOperation({ summary: 'Create saving' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSavingDto, @Req() request: Request) {
    const result = await this.savingService.create(
      dto,
      request.user?.userId || '',
    );
    return new CustomApiResponse('Saving created successfully.', result);
  }

  @Get()
  @ApiQuery({ name: 'status', enum: SavingStatus, required: false })
  @ApiQuery({ name: 'type', enum: SavingProductType, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'mobile',
  })
  async findAll(
    @Req() request: Request,
    @Query('status') status?: SavingStatus,
    @Query('type') type?: SavingProductType,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.savingService.findAll({
      status,
      type,
      page: Number(page),
      limit: Number(limit),
      search,
      currentUser: request.user as any,
    });

    return new CustomApiResponse('Fetched savings successfully.', result);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const result = await this.savingService.findOne(id);
    return new CustomApiResponse('Fetched saving successfully.', result);
  }

  @Put(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    await this.savingService.deactivate(id);
    return new CustomApiResponse('Saving deactivated.', true);
  }

  @Put(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    await this.savingService.activate(id);
    return new CustomApiResponse('Saving activated.', true);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.savingService.remove(id);
    return new CustomApiResponse('Saving deleted successfully.', result);
  }
}
