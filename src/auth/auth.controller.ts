import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { LoginDto } from 'src/users/dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { EmailService } from 'src/email/email.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 201,
    description: 'Check email for otp verification',
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.signIn(loginDto);
    return new CustomApiResponse('Login Successfully', result);
  }

  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: 'Registered successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    const result = await this.authService.register(registerDto);
    return new CustomApiResponse('Registered successfully', result);
  }

  @ApiOperation({ summary: 'Set Password' })
  @HttpCode(HttpStatus.OK)
  @Post('set-password')
  async setPassword(@Body() setPasswordDto: SetPasswordDto) {
    await this.authService.setPassword(setPasswordDto);
    return new CustomApiResponse('Password set successfully', null);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return new CustomApiResponse('Token refreshed successfully', result);
  }

  // @ApiOperation({ summary: "Forgot password" })
  // @ApiResponse({
  //     status: 200,
  //     description: "Password_reset request accepted"
  // })
  // @Post('forget-password')
  // async requestPasswordReset(@Body() email: ForgotPWordDto) {
  //     const result = await this.authService.requestToResetPassword(email.email)
  //     return new CustomApiResponse("Please confirm your request on email", null)
  // }

  // @ApiOperation({ summary: "Reset password" })
  // @ApiResponse({
  //     status: 201,
  //     description: "Password reset successfully"
  // })
  // @Put('reset-password')
  // async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
  //     const result = await this.authService.changePassword(changePasswordDto)
  //     return new CustomApiResponse("Reset password successfully", result)
  // }

  // @ApiOperation({ summary: "OTP verification" })
  // @ApiResponse({
  //     status: 200,
  //     description: "Logged in successfully"
  // })
  // @Post('verify-otp')
  // @HttpCode(HttpStatus.CREATED)
  // async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
  //     const result = await this.emailService.verifyOtp(verifyOtpDto)
  //     return new CustomApiResponse("Welcome back", result.entity, result.token)
  // }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Your profile' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved successfully',
  })
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const result = await this.authService.getProfile(req.user?.userId || '');
    return new CustomApiResponse('Your profile', result);
  }
}
