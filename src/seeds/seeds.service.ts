import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/constants/role.enum';
import { User } from 'src/users/entity/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createSuperAdmin() {
    const superAdminExists = await this.usersRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const superAdmin = this.usersRepository.create({
        firstName: 'Super',
        lastName: 'Admin',
        nationalId: 'SUPER_ADMIN_ID',
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        deleted: false,
      });

      await this.usersRepository.save(superAdmin);
      console.log('Super Admin user created successfully');
    } else {
      console.log('Super Admin already exists');
    }
  }
}
