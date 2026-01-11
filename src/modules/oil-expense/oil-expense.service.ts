import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common';
import { UpdateOilIntervalDto } from './dto/update-oil-interval.dto';
import { CreateOilExpenseDto } from './dto/create-oil-expense.dto';

@Injectable()
export class OilExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const vehicles = await this.prisma.vehicle.findMany({
      select: {
        id: true,
        number: true,
        oilLastChangedHour: true,
        oilChangeIntervalHours: true,
        totalHoursRan: true,
      },
    });

    return vehicles.map((vehicle) => {
      const currentHours = vehicle.totalHoursRan || 0;
      const lastChanged = vehicle.oilLastChangedHour || 0;
      const interval = vehicle.oilChangeIntervalHours || 0;
      const hoursLeft = interval - (currentHours - lastChanged);
      
      let status = 'Good';
      if (hoursLeft <= 0) {
        status = 'Maintenance Due'; // Or 'Saturated' as per user might imply, keeping standard
      }

      return {
        vehicleNo: vehicle.number,
        status: status,
        hoursLeft: hoursLeft,
        lastChangedOn: lastChanged,
        currentHours: currentHours,
        oilChangeInterval: interval,
        vehicleId: vehicle.id // Useful for frontend to call Patch
      };
    });
  }

  async getNotificationVehicles() {
    const allVehicles = await this.findAll();
    return allVehicles.filter(vehicle => vehicle.hoursLeft < 100);
  }

  async updateInterval(vehicleId: number, updateDto: UpdateOilIntervalDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        oilChangeIntervalHours: updateDto.oilChangeInterval,
      },
    });
  }

  async create(createDto: CreateOilExpenseDto) {
    const { vehicleId, driverId, amount, hours, description, expenseTime } = createDto;

    return this.prisma.$transaction(async (prisma) => {
      // Fetch current vehicle state
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
      }

      let updatedVehicle = vehicle;
      let expense = null;

      // 1. Add totalHoursRan if provided
      if (hours) {
        const currentTotal = vehicle.totalHoursRan || 0;
        const newTotal = currentTotal + hours;
        
        updatedVehicle = await prisma.vehicle.update({
          where: { id: vehicleId },
          data: {
            totalHoursRan: newTotal,
          },
        });
      }

      // 2. Create Expense if amount is provided
      if (amount) {
        if (!driverId) {
           throw new NotFoundException('Driver ID is required when creating an expense');
        }

        expense = await prisma.expense.create({
          data: {
            vehicleId,
            userId: driverId,
            amount: amount,
            category: 'Oil Change',
            description: description || 'Oil Change',
            expenseTime: expenseTime ? new Date(expenseTime) : new Date(),
          },
        });

        // Update oilLastChangedHour to current total hours (resetting the cycle)
        // We use the updated total hours if we just updated it, or the existing one
        const currentTotalHours = updatedVehicle.totalHoursRan || 0;
        
        updatedVehicle = await prisma.vehicle.update({
          where: { id: vehicleId },
          data: {
            oilLastChangedHour: currentTotalHours,
          },
        });
      }

      return { expense, vehicle: updatedVehicle };
    });
  }
}
