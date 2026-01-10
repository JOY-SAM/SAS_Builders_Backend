import { Body, Controller, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OilExpenseService } from './oil-expense.service';
import { UpdateOilIntervalDto } from './dto/update-oil-interval.dto';
import { CreateOilExpenseDto } from './dto/create-oil-expense.dto';
import { UpdateOilIntervalPipe } from './flow/update-oil-interval.pipe';
import { OilExpenseStatusEntity } from './entities/oil-expense-status.entity';
import { OilExpenseTransactionEntity } from './entities/oil-expense-transaction.entity';
import { VehicleEntity } from '../vehicles/entities/vehicle.entity';

@ApiTags('Oil Expense')
@Controller('oil-expense')
export class OilExpenseController {
  constructor(private readonly oilExpenseService: OilExpenseService) {}

  @Get()
  @ApiOperation({ summary: 'Get oil expense status for all vehicles', description: 'Response: OilExpenseStatusEntity[]' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles with oil expense status (OilExpenseStatusEntity[])',
    type: OilExpenseStatusEntity,
    isArray: true,
  })
  findAll() {
    return this.oilExpenseService.findAll();
  }

  @Patch(':vehicleId')
  @ApiOperation({ summary: 'Update oil change interval for a vehicle', description: 'Params: vehicleId (number), Request Body: UpdateOilIntervalDto, Response: VehicleEntity' })
  @ApiResponse({ status: 200, description: 'Interval updated successfully (VehicleEntity)', type: VehicleEntity })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  updateInterval(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Body(UpdateOilIntervalPipe) updateDto: UpdateOilIntervalDto,
  ) {
    return this.oilExpenseService.updateInterval(vehicleId, updateDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create an oil expense and reset oil change hours', description: 'Request Body: CreateOilExpenseDto, Response: OilExpenseTransactionEntity' })
  @ApiResponse({ status: 201, description: 'Expense created and vehicle updated (OilExpenseTransactionEntity)', type: OilExpenseTransactionEntity })
  create(@Body() createDto: CreateOilExpenseDto) {
    return this.oilExpenseService.create(createDto);
  }
}
