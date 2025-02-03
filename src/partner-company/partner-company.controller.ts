import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/role.enum';

@Controller('partner-company')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class PartnerCompanyController {
  constructor(private readonly partnerCompanyService: PartnerCompanyService) { }

  @ApiOperation({ summary: "Get all image  urls" })
  @ApiResponse({
    status: 200,
    description: "retrieved all successfully"
  })
  @Get('all')
  // @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllImages() {
    const result = await this.partnerCompanyService.getImages();
    return new CustomApiResponse("Fetched all image urls successfully", result)
  }
  @ApiOperation({ summary: "Create a partner company" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPartnerCompanyDto: CreatePartnerCompanyDto) {
    const result = await this.partnerCompanyService.create(createPartnerCompanyDto);
    return new CustomApiResponse("Created partner company successfully", result)
  }

  @ApiOperation({ summary: "Get all partner companies" })
  @ApiResponse({
    status: 200,
    description: "retrieved all successfully"
  })
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.partnerCompanyService.findAll();
    return new CustomApiResponse("Fetched all partner companies successfully", result)
  }

  @ApiOperation({ summary: "Get single partner company" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.partnerCompanyService.findOne(id);
    return new CustomApiResponse("Fetched partner company successfully", result)
  }

  @ApiOperation({ summary: "Update partner company" })
  @ApiResponse({
    status: 200,
    description: "updated successfully"
  })
  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    const result = await this.partnerCompanyService.update(id, updatePartnerCompanyDto);
    return new CustomApiResponse("Updated partner company successfully", result)
  }

  @ApiOperation({ summary: "Delete single partner companies" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removePartnerComp(@Param('id') id: string) {
    const result = await this.partnerCompanyService.remove(id);
    return new CustomApiResponse("Delete partner company successfully", result)
  }

  @ApiOperation({ summary: "Delete all partner companies" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete()
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeAllParternComps(id: string) {
    const result = await this.partnerCompanyService.removeAll();
    return new CustomApiResponse("Delete all partner companies successfully", result)
  }


  
}
