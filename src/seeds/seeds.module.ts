import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/users.entity';
import { SeedsService } from './seeds.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [SeedsService],
})
export class SeedsModule { }
