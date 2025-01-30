import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('partner-company')
export class PartnerCompanyController {
  constructor(private readonly partnerCompanyService: PartnerCompanyService) { }

  @ApiOperation({ summary: "Create a partner company" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPartnerCompanyDto: CreatePartnerCompanyDto) {
    const result = await this.partnerCompanyService.create(createPartnerCompanyDto);
    return new CustomApiResponse("Created partner company successfully", result)
  }

  @ApiOperation({ summary: "Get all partner companies" })
  @ApiResponse({
    status: 201,
    description: "retrieved all successfully"
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.partnerCompanyService.findAll();
    return new CustomApiResponse("Fetched all partner companies successfully", result)
  }

  @ApiOperation({ summary: "Get single partner company" })
  @ApiResponse({
    status: 201,
    description: "retrieved successfully"
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.partnerCompanyService.findOne(id);
    return new CustomApiResponse("Fetched partner company successfully", result)
  }

  @ApiOperation({ summary: "Update partner company" })
  @ApiResponse({
    status: 201,
    description: "updated successfully"
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    const result = await this.partnerCompanyService.update(id, updatePartnerCompanyDto);
    return new CustomApiResponse("Updated partner company successfully", result)
  }

  @ApiOperation({ summary: "Delete single partner companies" })
  @ApiResponse({
    status: 201,
    description: "deleted successfully"
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removePartnerComp(@Param('id') id: string) {
    const result = await this.partnerCompanyService.remove(id);
    return new CustomApiResponse("Delete partner company successfully", result)
  }

  @ApiOperation({ summary: "Delete all partner companies" })
  @ApiResponse({
    status: 201,
    description: "deleted successfully"
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeAllParternComps(id: string) {
    const result = await this.partnerCompanyService.removeAll();
    return new CustomApiResponse("Delete all partner companies successfully", result)
  }
}
