import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import { SetPasswordDto } from './dto/set-password.dto';
import { User } from 'src/users/entity/users.entity';
import { UserRole } from 'src/constants/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenService: TokenService,
    @InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {}

  private async generateTokens(
    userId: string,
    role: string,
    email?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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
  }

  async signIn(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOne({
      where: [
        { email: loginDto.identifier },
        { nationalId: loginDto.identifier },
        { phoneNumber: loginDto.identifier },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const doesPwordsMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!doesPwordsMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.role,
      user.email || '',
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const createdUser = await this.usersService.createUser({
      ...createUserDto,
      role: UserRole.USER,
    });

    if (!createdUser) {
      throw new InternalServerErrorException('User registration failed');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      createdUser.id,
      createdUser.role,
      createdUser.email || '',
    );

    return {
      user: createdUser,
      accessToken,
      refreshToken,
    };
  }

  async setPassword(data: SetPasswordDto): Promise<boolean> {
    const { token, password: newPassword } = data;
    await this.usersService.updatePassword({ token, newPassword });
    return true;
  }

  async refreshToken(
    refToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded: { userId: string; email: string; role: string } =
      await this.jwtService.verifyAsync(refToken, {
        secret: this.configService.get<string>('JWT_SECRET') as string,
      });

    const { accessToken, refreshToken } = await this.generateTokens(
      decoded.userId,
      decoded.role,
      decoded.email,
    );
    return { accessToken, refreshToken };
  }

  async getProfile(userId: string): Promise<User> {
    const res = await this.usersService.findUserById(userId);
    return res;
  }
}
