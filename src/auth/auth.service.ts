import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { OtpEntity } from '../otp/entity/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { TokenService } from 'src/token/token.service';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
        private tokenService: TokenService,
        @InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>,
        private configService: ConfigService
    ) { }

    private async generateTokens(userId: string, email: string, role: string): Promise<any> {
        try {
            const payload = { userId, email, role };

            const accessToken = await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            });

            const refreshToken = await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '7d',
            });

            return { accessToken, refreshToken };
        } catch (error) {
            throw new InternalServerErrorException('Error generating tokens');
        }
    }

    async signIn(loginDto: LoginDto): Promise<any> {
        try {
            const user = await this.usersService.findUserByEmail(loginDto.email);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const doesPwordsMatch = await bcrypt.compare(loginDto.password, user.password);

            if (!doesPwordsMatch) {
                throw new UnauthorizedException('Password is incorrect');
            }

            const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

            return {
                entity: user,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.log(error);
            throw new InternalServerErrorException('An error occurred during sign-in');
        }
    }

    async register(createUserDto: CreateUserDto): Promise<any> {
        try {
            const createdUser = await this.usersService.createUser(createUserDto);

            if (!createdUser) {
                throw new InternalServerErrorException('User registration failed');
            }

            const { accessToken, refreshToken } = await this.generateTokens(createdUser.id, createdUser.email, createdUser.role);

            return {
                entity: createdUser,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            throw new InternalServerErrorException('An error occurred during registration');
        }
    }

    async setPassword(data: SetPasswordDto): Promise<boolean> {
        try {
            const { token, password: newPassword } = data;
            await this.usersService.updatePassword({ token, newPassword });

            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error setting new password');
        }
    }


    async refreshToken(refreshToken: string): Promise<any> {
        const decoded = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });

        const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };

        const newAccessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '1h',
        });

        return { accessToken: newAccessToken };
    }
}
