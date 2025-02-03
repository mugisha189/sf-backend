import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfirmationTokenService } from 'src/confirmationToken/confirmToken.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import path from 'path';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  private avatarFolderName: string

  constructor(
    private confirmTokenService: ConfirmationTokenService,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) {
    this.avatarFolderName = "USER_AVATARS"

  }


  async createUser(createUserDto: CreateUserDto, file: Express.Multer.File): Promise<Users> {
    try {

      // console.log('creteUser password ', createUserDto.password );
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException("Password must match")
      }

      const result = await this.cloudinaryService.uploadFile(file, this.avatarFolderName)
      if (!result) throw new BadRequestException("Upload failed");
      console.log('Upload completed');

      const user = new Users()

      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.email = createUserDto.email;
      user.phoneNumber = createUserDto.phoneNumber;
      user.nationalId = createUserDto.nationalId;
      user.role = createUserDto.role;
      user.password = await bcrypt.hash(createUserDto.password, 10);
      user.avatarUrl = result.imageUrl
      user.avatarPublicId = result.imagePublicId;


      return await this.userRepo.save(user)

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  async findUserByEmail(email: string): Promise<Users> {
    try {
      console.log('email ', email);
      const user = await this.userRepo.findOne({ where: { email } })
      if (!user) throw new NotFoundException(`User not found`);

      return user
    } catch (error) {
      throw error
    }
  }


  async findUserById(id: string): Promise<Users> {
    try {
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException(`User not found`);

      return user
    } catch (error) {
      throw error
    }
  }



  async findAll(): Promise<Users[]> {
    try {
      return await this.userRepo.find()
    } catch (error) {
      throw error
    }
  }

  async updatePassword(changePasswordDto: ChangePasswordDto): Promise<Users> {
    try {
      const user = await this.userRepo.findOneBy({ email: changePasswordDto.email })
      if (!user) throw new BadRequestException("Invalid link or expired");

      const confirmToken = await this.confirmTokenService.findOneByUserId(user.id)
      if (!confirmToken) throw new BadRequestException("Invalid link or expired");

      if (confirmToken.token !== changePasswordDto.token) throw new BadRequestException("Invalid link or expired");

      const saltRounds = 10
      const hashedNewPword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds)

      user.password = hashedNewPword

      return await this.userRepo.save(user)

    } catch (error) {
      throw error
    }
  }


  async updateUser(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    try {

      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException("User not found");

      if (!updateUserDto.email && !updateUserDto.firstName && !updateUserDto.lastName && !updateUserDto.nationalId && !updateUserDto.phoneNumber && !updateUserDto.password) {
        throw new BadRequestException('Please fill all required fields')
      }


      const fileNameOnly = file.originalname.split('.')[0]

      // Check if the same file is uploaded
      if (user.avatarPublicId !== fileNameOnly) {
        const result = await this.cloudinaryService.deleteFile(user.avatarPublicId)
        if (!result) throw new BadRequestException("Image deletion failed")
      }

      // Upload the new image
      const result = await this.cloudinaryService.uploadFile(file, this.avatarFolderName)
      if (!result) throw new BadRequestException("Image upload failed")


      const saltRounds = 10

      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds)

      Object.assign(user, {
        ...updateUserDto,
        avatarUrl: result.imageUrl,
        avatarPublicId: result.imagePublicId
      })

      return this.userRepo.save(user)

    } catch (error) {
      throw error
    }
  }

  async deleteUser(id: string): Promise<Boolean> {
    try {
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException('User not found')

      const isAvatarDeleted = await this.cloudinaryService.deleteFile(user.avatarPublicId)
      if(!isAvatarDeleted) throw new BadRequestException("Image deletion failed")


      const result = await this.userRepo.delete({ id })

      return result.affected !== 0;

    } catch (error) {
      throw error
    }
  }

  
  async deleteAllUser(): Promise<Boolean> {
    try {
      const users = await this.userRepo.find({select: ['avatarPublicId']})
      const avatarDeletePromises = users
      .filter(user => user.avatarPublicId)
      .map((user) => this.cloudinaryService.deleteFile(user.avatarPublicId))

      await Promise.all(avatarDeletePromises)
      const result = await this.userRepo.delete({})

      return result.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}

