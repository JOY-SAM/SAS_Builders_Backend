import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/provider/prisma.provider';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    return this.prisma.driver.create({
      data: createDriverDto,
    });
  }

  async findAll() {
    return this.prisma.driver.findMany();
  }

  async findOne(id: number) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    // Check if driver exists
    await this.findOne(id);
    
    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }
}
