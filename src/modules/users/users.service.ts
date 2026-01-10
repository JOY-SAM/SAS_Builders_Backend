import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/provider/prisma.provider';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Password should be hashed before calling this or handled here. Plan says Auth handles hashing.
        name: data.name,
        phoneNumber: data.phoneNumber,
        isAdmin: false,
        isDriver: false,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
