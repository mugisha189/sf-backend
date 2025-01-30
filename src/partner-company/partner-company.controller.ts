import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';

@Controller('partner-company')
export class PartnerCompanyController {
  constructor(private readonly partnerCompanyService: PartnerCompanyService) {}

  @Post()
  create(@Body() createPartnerCompanyDto: CreatePartnerCompanyDto) {
    return this.partnerCompanyService.create(createPartnerCompanyDto);
  }

  @Get()
  findAll() {
    return this.partnerCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    return this.partnerCompanyService.update(+id, updatePartnerCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerCompanyService.remove(+id);
  }
}
