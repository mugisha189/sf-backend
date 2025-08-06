import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenService } from 'src/token/token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRole } from 'src/constants/role.enum';
import { UserSubscription } from './entity/user-subscription.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';

@Injectable()
export class UsersService {
  private avatarFolderName: string;

  constructor(
    private tokenService: TokenService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(SavingProduct)
    private savingProductRepo: Repository<SavingProduct>,
    @InjectRepository(UserSubscription)
    private userSubscriptionRepo: Repository<UserSubscription>,
  ) {
    this.avatarFolderName = 'USER_AVATARS';
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Password must match');
    }

    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return await this.userRepo.save(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'serviceProvider',
        'savingInstitution',
        'userCooperatives',
        'userCooperatives.cooperative',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const simplifiedCooperatives: {
      id: string;
      role: string;
      cooperative: {
        id: string;
        name: string;
      };
    }[] = user.userCooperatives.map((link) => ({
      id: link.id,
      role: link.role,
      cooperative: {
        id: link.cooperative.id,
        name: link.cooperative.name,
      },
    }));

    return {
      ...user,
      userCooperatives: simplifiedCooperatives as any,
    };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async updatePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const token = await this.tokenService.findOneByToken(
      changePasswordDto.token,
    );
    console.log(token);
    if (!token || token.token !== changePasswordDto.token) {
      throw new BadRequestException('Invalid link or expired');
    }

    const user = await this.userRepo.findOneBy({ id: token.userId });
    if (!user) throw new BadRequestException('Invalid link or expired');

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    return await this.userRepo.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    Object.assign(user, updateUserDto);

    return this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const isUserDeleted = await this.userRepo.update(id, { deleted: true });
    if (isUserDeleted.affected === 0)
      throw new NotFoundException('User not found');

    return true;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { phoneNumber, deleted: false },
    });
  }

  async ussdRegister(data: {
    phoneNumber: string;
    nationalId: string;
  }): Promise<User> {
    const newUser = this.userRepo.create({
      firstName: 'USSD',
      lastName: 'User',
      email: `${data.phoneNumber}@ussd.local`,
      phoneNumber: data.phoneNumber,
      nationalId: data.nationalId,
      role: UserRole.USER,
      password: await bcrypt.hash('12345', 10),
    });

    return await this.userRepo.save(newUser);
  }

  async getUserSubscriptions(userId: string) {
    const result = await this.userSubscriptionRepo.find({
      where: { user: { id: userId } },
      relations: ['savingProduct'],
    });
    return result;
  }

  async addNewSubscription(
    userId: string,
    savingProductId: string,
  ): Promise<UserSubscription> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const product = await this.savingProductRepo.findOne({
      where: { id: savingProductId },
    });
    if (!product) throw new NotFoundException('Saving product not found');
    const existing = await this.userSubscriptionRepo.findOne({
      where: { user: { id: userId }, savingProduct: { id: savingProductId } },
    });
    if (existing)
      throw new ConflictException('User is already subscribed to this product');
    const subscription = this.userSubscriptionRepo.create({
      user,
      savingProduct: product,
    });
    return this.userSubscriptionRepo.save(subscription);
  }
}
