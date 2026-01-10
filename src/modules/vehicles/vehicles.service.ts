import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/provider/prisma.provider';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        oilLastChangedHour: createVehicleDto.oilLastChangedHour,
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany();
  }

  async findOne(id: number) {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...updateVehicleDto,
        oilLastChangedHour: updateVehicleDto.oilLastChangedHour,
      },
    });
  }
}
