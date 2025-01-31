import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfirmationTokenService } from 'src/confirmationToken/confirmToken.service';
import { ChangePasswordDto } from './dto/change-password.dto';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    private confirmTokenService: ConfirmationTokenService,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) { }


  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    try {

      // console.log('creteUser password ', createUserDto.password );
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException()
      }
      const user = new Users()

      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.email = createUserDto.email;
      user.phoneNumber = createUserDto.phoneNumber;
      user.nationalId = createUserDto.nationalId;
      user.password = await bcrypt.hash(createUserDto.password, 10);
      // user.password = createUserDto.password

      return await this.userRepo.save(user)

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message)
      }

      throw error
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
      const user = await this.userRepo.findOneBy({email: changePasswordDto.email})
      if(!user) throw new BadRequestException("Invalid link or expired");

      const confirmToken = await this.confirmTokenService.findOneByUserId(user.id)
      if(!confirmToken) throw new BadRequestException("Invalid link or expired");

      if(confirmToken.token !== changePasswordDto.token) throw new BadRequestException("Invalid link or expired");
      
      const saltRounds= 10
      const hashedNewPword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds)

      user.password = hashedNewPword

      return await this.userRepo.save(user)

      } catch (error) {
      throw error
    }
  }


  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    try {
      const user = await this.userRepo.findOne({ where: { id } })
      if (!user) throw new NotFoundException("User not found");

      if (!updateUserDto.email && !updateUserDto.firstName && !updateUserDto.lastName && !updateUserDto.nationalId && !updateUserDto.phoneNumber && !updateUserDto.password) {
        throw new BadRequestException('Please fill all required fields')
      }

      const saltRounds = 10
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds)

      Object.assign(user, updateUserDto)

      return this.userRepo.save(user)

    } catch (error) {
      throw error
    }
  }

  async deleteUser(id: string): Promise<{ affected?: number }> {
    try {
      if (!this.userRepo.findOne({ where: { id } })) throw new NotFoundException('User not found')
      const result = await this.userRepo.delete({ id })

      return { affected: result.affected ?? undefined }

    } catch (error) {
      throw error
    }
  }

  async deleteAllUser(): Promise<{ affected?: number }> {
    try {
      const result = await this.userRepo.delete({})

      return { affected: result.affected ?? undefined }

    } catch (error) {
      throw error
    }
  }
}

