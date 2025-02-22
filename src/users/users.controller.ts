import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/constants/role.enum';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('users')
@ApiTags("users")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
    constructor(private userService: UsersService) { }

    @ApiOperation({ summary: "Fetch user by userId" })
    @ApiResponse({
        status: 200,
        description: "Retrieved successfully"
    })
    @Get(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') id: string) {
        const result = await this.userService.findUserById(id)
        return new CustomApiResponse("Retrived successfully", result)
    }

    @ApiOperation({ summary: "Fetch all users" })
    @ApiResponse({
        status: 200,
        description: "Retrieved successfully"
    })
    // @UseGuards(AuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.SUPER_ADMIN, UserRole.SUBSCRIBER)
    async getAllUsers() {
        const result = await this.userService.findAll()
        return new CustomApiResponse("Retrived all successfully", result)

    }

    @ApiOperation({ summary: "Update user" })
    @ApiResponse({
        status: 200,
        description: "Updated successfully"
    })
    @Put(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
        const result = await this.userService.updateUser(id, updateUserDto, file)
        return new CustomApiResponse("Updated user successfully", result)

    }

    @ApiOperation({ summary: "Delete user by userId" })
    @ApiResponse({
        status: 200,
        description: "Deleted successfully"
    })
    // @UseGuards(AuthGuard)
    @Delete(':id')
    @Roles(UserRole.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    async deleteUser(@Param('id') id: string) {
        const result = await this.userService.deleteUser(id)
        return new CustomApiResponse("Deleted successfully", result)

    }

}
