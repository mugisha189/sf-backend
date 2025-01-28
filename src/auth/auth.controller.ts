import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from 'src/users/dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from 'src/otp/dto/verifyOtp.dto';
import { ForgotPWordDto } from 'src/users/dto/forget-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private emailService: EmailService

    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.signIn(loginDto)
        return new CustomApiResponse(result, null)
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() registerDto: CreateUserDto) {
        const result = await this.authService.register(registerDto)
        return new CustomApiResponse("Registered successfully", result.entity, result.token)
    }


    @Post('forget-password')
    async requestPasswordReset(@Body() email: ForgotPWordDto){
        const result = await this.authService.requestToResetPassword(email.email)
        return new CustomApiResponse("Please confirm your request on email", null)
    }

    @Put('reset-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        const result = await this.authService.changePassword(changePasswordDto)
        return new CustomApiResponse("Reset password successfully", result)
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.CREATED)
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        const result = await this.emailService.verifyOtp(verifyOtpDto)
        return new CustomApiResponse("Welcome back", result.entity, result.token)
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return new CustomApiResponse("Your profile", req.user)
    }
}
