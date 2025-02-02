import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from 'src/users/dto/login.dto';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { OtpEntity } from '../otp/entity/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { ConfirmationTokenService } from 'src/confirmationToken/confirmToken.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
        private confirmTokenService: ConfirmationTokenService,
        @InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>
    ) { }

    async signIn(loginDto: LoginDto): Promise<string> {
        try {
            const user = await this.usersService.findUserByEmail(loginDto.email)
            const hashedPassword = await bcrypt.hash(loginDto.password, 10)
            const doesPwordsMatch = await bcrypt.compare(loginDto.password, user.password)

            console.log('doesPwordsMatch', doesPwordsMatch);
            if (!doesPwordsMatch) throw new NotFoundException('Password not correct');

            // TODO: Send verification code to email
            await this.emailService.sendOtpToEmail(loginDto.email)


            return "Please check your email for OTP"

        } catch (error) {
            throw error
        }
    }



    async register(createUserDto: CreateUserDto): Promise<any> {
        try {
            // console.log('create use dto ', createUserDto);
            const createdUser = await this.usersService.createUser(createUserDto)
            const payload = {
                userId: createdUser.id,
                email: createdUser.email,
                role: createdUser.role,
            }

            return {
                entity: createdUser,
                token: await this.jwtService.signAsync(payload)
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }


    async requestToResetPassword(email: string):Promise<Boolean>{
        try {
            // Check if user exists
            const user = await this.usersService.findUserByEmail(email)

            //Delete the user
            await this.confirmTokenService.deleteToken(user.id)

            let resetToken = randomBytes(32).toString("hex")
            const tokenHash = await bcrypt.hash(resetToken, 10)

            // Create new confirmation token
            const token = await this.confirmTokenService.createConfirmToken({token: tokenHash, userId: user.id})

            // Send password reset link to user
            return this.emailService.sendUserConfirmation(email, token.token)

        } catch (error) {
            throw error
        }
    }
    async changePassword(changePasswordDto: ChangePasswordDto): Promise<any> {
        try {
            // Return updated user
            return await this.usersService.updatePassword( changePasswordDto)
        } catch (error) {
            throw error
        }
    }
}
