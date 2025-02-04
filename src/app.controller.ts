import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('homepage')
export class AppController {
    constructor(private appService: AppService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    hello(){
        return this.appService.hello()
    }

}
