import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') id: string){
        return this.userService.findUserById(id)
    }

    // @UseGuards(AuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(){
        return this.userService.findAll()
    }


    @UseGuards(AuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto){
        return this.userService.updateUser(id,updateUserDto)
    }

    // @UseGuards(AuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string){
        return this.userService.deleteUser(id)
    }

    // @UseGuards(AuthGuard)
    @Delete()
    @HttpCode(HttpStatus.OK)
    async deleteAllUser(){
        return this.userService.deleteAllUser()
    }
}
