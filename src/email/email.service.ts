import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomInt } from "crypto";
import { OtpEntity } from "src/otp/entity/otp.entity";
import { OTP_CODE_STATUS } from "src/constants/constants";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { VerifyOtpDto } from "../otp/dto/verifyOtp.dto";

@Injectable()
export class EmailService {
    constructor(
        @InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>,
        private mailerService: MailerService,
        private configService: ConfigService,
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }
    async sendOtpToEmail(email: string):Promise<boolean> {
        try {
            // Generate numerical code
            const otpCode = randomInt(100000, 999999);
            const expiresAt = new Date(Date.now() + 1 * 60 * 1000); //1 seconds expiry

            // Validate the email address
            if (!this.isValidEmail(email)) throw new UnauthorizedException("Email is not valid")
            
                // Delete all OTP passwords of the email
            await this.otpRepo.delete({ email })

            // Generate new OTP
            const otp = new OtpEntity()
            otp.email = email
            otp.otpCode = otpCode
            otp.expiresAt = expiresAt
            otp.otpStatus = OTP_CODE_STATUS.AVAILABLE

            // Save the OTP to db
            await this.otpRepo.save(otp)

            // Send otp 
            const subject = "OTP verification"
            const hbsTemplateName = './otp'
            const context = {
                otpCode
            }


            await this.sendEmail(email, subject, hbsTemplateName, context)
            return true
        } catch (error) {
            throw error
        }
    }


    async sendUserConfirmation(email: string, token: string):Promise<Boolean> {
        try {
            // Check if client url is specified
            const clientUrl = this.configService.get("FRONTEND_BASE_URL")
            if(!clientUrl) throw new BadRequestException("No client URL specified")

            // Link to be sent
            const link=  `${clientUrl}/password-reset/?token=${token}?email=${email}`
            
            // Send the password reset link to email
            const subject = "PASSWORD RESET CONFIRMATION"
            const hbsTemplateName = './confirmation'
            const context = {
                link
            }
            this.sendEmail(email,subject, hbsTemplateName, context )
            return true
        } catch (error) {
            throw error
        }
    }


    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
        try {
            // Check if email and code is provided
            if (!verifyOtpDto.email) {
                throw new BadRequestException("No email provided")
            } else if (!verifyOtpDto.otpCode) {
                throw new BadRequestException("No code to verify")
            }

            //Check if the email exists
            await this.usersService.findUserByEmail(verifyOtpDto.email)

            // Obtain the otp to be verfied
            const otpRecord = await this.otpRepo.findOne({ where: { email: verifyOtpDto.email, otpCode: verifyOtpDto.otpCode } });

            // Check if the code is reused
            if (!otpRecord) {
                throw new UnauthorizedException("Invalid code");
            }
            
            // Delete the used otp
            if(otpRecord.otpStatus === OTP_CODE_STATUS.USED){
                await this.otpRepo.delete({ email: verifyOtpDto.email, otpCode: verifyOtpDto.otpCode });
                throw new UnauthorizedException("OTP is only used once")
            }
            // Check if the expiry date of code has reached
            if (otpRecord.expiresAt < new Date()) {
                otpRecord.otpStatus = OTP_CODE_STATUS.USED
                await this.otpRepo.save(otpRecord)
                throw new UnauthorizedException("code expired");
            }

            
            // Update the code as USED
            otpRecord.otpStatus=OTP_CODE_STATUS.USED
            await this.otpRepo.save(otpRecord)

            // Get the user
            const user = await this.usersService.findUserByEmail(verifyOtpDto.email);

            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role
            }

            // Generate the jwtToken
            const token = await this.jwtService.signAsync(payload)
            return {
                entity: user,
                token
            }

        } catch (error) {
            throw error
        }
    }


    async sendEmail(email: string, subject: string, HbstemplateName: string, context: Record<string, any>) {
        try {

            // Send an otp
            await this.mailerService.sendMail({
                to: email,
                subject: subject,
                template: `${HbstemplateName}`, //hbs is appended automatically
                context
                // html: `<p>Your otp is  ${otpCode}</p>`
            })

        } catch (error) {
            console.log('Sending failed');
            throw error
        }
    }

    
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}