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


  async createUser(createUserDto: CreateUserDto, userAvatar: Express.Multer.File): Promise<Users> {
    try {
      // Check if password and confirmPassword matches
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException("Password must match")
      }

      // upload userAvatar to cloudinary
      const result = await this.cloudinaryService.uploadFile(userAvatar, this.avatarFolderName)
      if (!result) throw new BadRequestException("Upload failed");

      // Remove file from registering dto
      const { file, ...dtoWithoutFile } = createUserDto

      // Create new user
      const user = new Users(
        {
          ...dtoWithoutFile,
          password: await bcrypt.hash(createUserDto.password, 10),
          avatarUrl: result.imageUrl,
          avatarPublicId: result.imagePublicId

        }
      )
      // Return saved user
      return await this.userRepo.save(user)

    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }


  async findUserByEmail(email: string): Promise<Users> {
    try {
      // Check if user exists by email
      const user = await this.userRepo.findOne({ where: { email } })
      if (!user) throw new NotFoundException(`User not found`);

      return user
    } catch (error) {
      throw error
    }
  }


  async findUserById(id: string): Promise<Users> {
    try {
      // Check if user exists by id
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException(`User not found`);

      return user
    } catch (error) {
      throw error
    }
  }



  async findAll(): Promise<Users[]> {
    try {
      // Get all users
      return await this.userRepo.find()
    } catch (error) {
      throw error
    }
  }

  async updatePassword(changePasswordDto: ChangePasswordDto): Promise<Users> {
    try {
      // Check if user exists by email
      const user = await this.userRepo.findOneBy({ email: changePasswordDto.email })
      if (!user) throw new BadRequestException("Invalid link or expired");

      // Check if token associated exists
      const confirmToken = await this.confirmTokenService.findOneByUserId(user.id)

      // Check if token associated is still valid
      if (!confirmToken) throw new BadRequestException("Invalid link or expired");
      if (confirmToken.token !== changePasswordDto.token) throw new BadRequestException("Invalid link or expired");

      // Hash new password
      const saltRounds = 10
      const hashedNewPword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds)

      // Update user with new hashed password
      user.password = hashedNewPword

      // Return updated user with new password
      return await this.userRepo.save(user)

    } catch (error) {
      throw error
    }
  }


  async updateUser(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    try {
      // Check if user exists 
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException("User not found");

      // Get filename only without extension
      const fileNameOnly = file.originalname.split('.')[0]

      // Check if the different file is uploaded
      if (user.avatarPublicId !== fileNameOnly) {

        // Then delete the old one
        const result = await this.cloudinaryService.deleteFile(user.avatarPublicId)
        if (!result) throw new BadRequestException("Image deletion failed")
      }

      // Upload the new image
      const result = await this.cloudinaryService.uploadFile(file, this.avatarFolderName)
      if (!result) throw new BadRequestException("Image upload failed")

      //  Update the user with new hashed password
      const saltRounds = 10
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds)

      // Update the user with new information
      Object.assign(user, {
        ...updateUserDto,
        avatarUrl: result.imageUrl,
        avatarPublicId: result.imagePublicId
      })

      // Return the updated user
      return this.userRepo.save(user)

    } catch (error) {
      throw error
    }
  }

  async deleteUser(id: string): Promise<Boolean> {
    try {
      // Check if user exists by id
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException('User not found')

      // Await for user and image deletion promises
      const [isAvatarDeleted, isUserDeleted] = await Promise.all([
        this.cloudinaryService.deleteFile(user.avatarPublicId),
        this.userRepo.delete({ id })
      ])

      // Check if avatar is deleted
      if (isAvatarDeleted) throw new BadRequestException("Image deletion failed")

      // If user is deleted
      if (isUserDeleted.affected === 0) {
        throw new NotFoundException("User not found");
      }

      return true
    } catch (error) {
      throw error
    }
  }


  async deleteAllUser(): Promise<Boolean> {
    try {
      const users = await this.userRepo.find({ select: ['avatarPublicId'] })
      if (users.length === 0) throw new BadRequestException('No users to delete')

      // Create promises for avatar deletions
      const avatarDeletePromises = users
        .filter(user => user.avatarPublicId)
        .map((user) => this.cloudinaryService.deleteFile(user.avatarPublicId))

      // Obtain results from promises
      const [avatarDeleteResults, usersDeleteResult] = await Promise.all([
        Promise.allSettled(avatarDeletePromises),
        this.userRepo.delete({})
      ])

      // Check if avatars were deleted successfully
      avatarDeleteResults.forEach((result, index) => {
        if (result.status === 'rejected') throw new Error(result.reason)
      })

      // Return whether all users were deleted successfully
      return usersDeleteResult.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}

