import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { LoginDto } from 'src/users/dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { ForgotPWordDto } from 'src/users/dto/forget-password.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private emailService: EmailService

    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: "User login" })
    @ApiResponse({
        status: 201,
        description: "Check email for otp verification"
    })
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.signIn(loginDto)
        return new CustomApiResponse(result, null)
    }

    @ApiOperation({ summary: "User Registration" })
    @ApiResponse({
        status: 201,
        description: "Registered successfully"
    })
    @HttpCode(HttpStatus.OK)
    @Post('register')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async register(@Body() registerDto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
        // console.log('registerdto ', registerDto);
        // console.log('file ', file);
        if(!file ) throw new NotFoundException("No file uploaded")
        const result = await this.authService.register(registerDto, file)
        return new CustomApiResponse("Registered successfully", result.entity, result.token)
    }


    @ApiOperation({ summary: "Forgot password" })
    @ApiResponse({
        status: 200,
        description: "Password_reset request accepted"
    })
    @Post('forget-password')
    async requestPasswordReset(@Body() email: ForgotPWordDto) {
        const result = await this.authService.requestToResetPassword(email.email)
        return new CustomApiResponse("Please confirm your request on email", null)
    }

    @ApiOperation({ summary: "Reset password" })
    @ApiResponse({
        status: 201,
        description: "Password reset successfully"
    })
    @Put('reset-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        const result = await this.authService.changePassword(changePasswordDto)
        return new CustomApiResponse("Reset password successfully", result)
    }



    @ApiOperation({ summary: "OTP verification" })
    @ApiResponse({
        status: 200,
        description: "Logged in successfully"
    })
    @Post('verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        const result = await this.emailService.verifyOtp(verifyOtpDto)
        return new CustomApiResponse("Welcome back", result.entity, result.token)
    }

    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Your profile" })
    @ApiResponse({
        status: 200,
        description: "Retrieved successfully"
    })
    @Get('profile')
    getProfile(@Req() req: any) {
        return new CustomApiResponse("Your profile", req.user)
    }
}
