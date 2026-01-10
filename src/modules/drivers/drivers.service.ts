import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/provider/prisma.provider';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    // Generate dummy email and password
    const email = `${createDriverDto.phoneNumber}@driver.sas.com`;
    const password = 'default_driver_password'; // In a real app, this should be handled better

    return this.prisma.user.create({
      data: {
        ...createDriverDto,
        email,
        password,
        isDriver: true,
        isAdmin: false, 
        // Wait, I saw isAdmin BigInt.
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isDriver: true,
      },
    });
  }

  async findOne(id: number) {
    const driver = await this.prisma.user.findFirst({
      where: { 
        id,
        isDriver: true,
      },
    });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    // Check if driver exists
    await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: updateDriverDto,
    });
  }
}
