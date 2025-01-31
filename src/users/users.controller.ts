import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/constants/role.enum';


@Controller('users')
@ApiTags("users")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
    constructor(private userService: UsersService){}

    @ApiOperation({summary: "Fetch user by userId"})
    @ApiResponse({
        status: 200,
        description: "Retrieved successfully"
    })
    @Get(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') id: string){
        return this.userService.findUserById(id)
    }

    @ApiOperation({summary: "Fetch all users"})
    @ApiResponse({
        status: 200,
        description: "Retrieved successfully"
    })
    // @UseGuards(AuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.SUPER_ADMIN)
    async getAllUsers(){
        return this.userService.findAll()
    }

    @ApiOperation({summary: "Update user"})
    @ApiResponse({
        status: 200,
        description: "Updated successfully"
    })
    @Put(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto){
        return this.userService.updateUser(id,updateUserDto)
    }

    @ApiOperation({summary: "Delete user by userId"})
    @ApiResponse({
        status: 200,
        description: "Deleted successfully"
    })
    // @UseGuards(AuthGuard)
    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string){
        return this.userService.deleteUser(id)
    }

    @ApiOperation({summary: "Delete all users"})
    @ApiResponse({
        status: 200,
        description: "Deleted all successfully"
    })
    // @UseGuards(AuthGuard)
    @Delete()
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async deleteAllUser(){
        return this.userService.deleteAllUser()
    }
}
