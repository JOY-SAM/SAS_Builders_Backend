import { Body, Controller, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OilExpenseService } from './oil-expense.service';
import { UpdateOilIntervalDto } from './dto/update-oil-interval.dto';
import { CreateOilExpenseDto } from './dto/create-oil-expense.dto';
import { UpdateOilIntervalPipe } from './flow/update-oil-interval.pipe';

@ApiTags('Oil Expense')
@Controller('oil-expense')
export class OilExpenseController {
  constructor(private readonly oilExpenseService: OilExpenseService) {}

  @Get()
  @ApiOperation({ summary: 'Get oil expense status for all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles with oil expense status',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          vehicleNo: { type: 'string', example: 'KA-01-AB-1234' },
          status: { type: 'string', example: 'Good' },
          hoursLeft: { type: 'number', example: 100 },
          lastChangedOn: { type: 'number', example: 1200 },
          currentHours: { type: 'number', example: 1400 },
          oilChangeInterval: { type: 'number', example: 300 },
          vehicleId: { type: 'number', example: 1 },
        },
      },
    },
  })
  findAll() {
    return this.oilExpenseService.findAll();
  }

  @Patch(':vehicleId')
  @ApiOperation({ summary: 'Update oil change interval for a vehicle' })
  @ApiResponse({ status: 200, description: 'Interval updated successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  updateInterval(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Body(UpdateOilIntervalPipe) updateDto: UpdateOilIntervalDto,
  ) {
    return this.oilExpenseService.updateInterval(vehicleId, updateDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create an oil expense and reset oil change hours' })
  @ApiResponse({ status: 201, description: 'Expense created and vehicle updated' })
  create(@Body() createDto: CreateOilExpenseDto) {
    return this.oilExpenseService.create(createDto);
  }
}
