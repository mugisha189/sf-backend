import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenService } from 'src/token/token.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  private avatarFolderName: string;

  constructor(
    private tokenService: TokenService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) {
    this.avatarFolderName = "USER_AVATARS";
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException("Password must match");
    }

    const user = new Users({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return await this.userRepo.save(user);
  }

  async findUserByEmail(email: string): Promise<Users> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findUserById(id: string): Promise<Users> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }



  async findAll(): Promise<Users[]> {
    return await this.userRepo.find();
  }

  async updatePassword(changePasswordDto: ChangePasswordDto): Promise<Users> {

    console.log(changePasswordDto)
    const token = await this.tokenService.findOneByToken(changePasswordDto.token)
    console.log(token)
    if (!token || token.token !== changePasswordDto.token) {
      throw new BadRequestException("Invalid link or expired");
    }

    const user = await this.userRepo.findOneBy({ id: token.userId });
    if (!user) throw new BadRequestException("Invalid link or expired");

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    return await this.userRepo.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File): Promise<Users> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    Object.assign(user, updateUserDto);

    return this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<Boolean> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    const isUserDeleted = await this.userRepo.update(id, { deleted: true });
    if (isUserDeleted.affected === 0) throw new NotFoundException("User not found");

    return true;
  }
}
