import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    hello(){
        return "home page is available"
    }
}
