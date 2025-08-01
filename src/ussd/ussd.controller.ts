import { Controller, Post, Body } from '@nestjs/common';
import { UssdService } from './ussd.service';

@Controller('ussd')
export class UssdController {
  constructor(private readonly ussdService: UssdService) {}

  @Post()
  async handleUSSD(@Body() body: any): Promise<string> {
    console.log(body);
    return this.ussdService.handleRequest(body);
  }
}
