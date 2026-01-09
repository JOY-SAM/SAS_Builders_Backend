import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DriverEntity } from './entities/driver.entity';

@ApiTags('Drivers')
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiResponse({ status: 201, description: 'The driver has been successfully created.', type: DriverEntity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'Return all drivers.', type: DriverEntity, isArray: true })
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by id' })
  @ApiResponse({ status: 200, description: 'Return the driver.', type: DriverEntity })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a driver' })
  @ApiResponse({ status: 200, description: 'The driver has been successfully updated.', type: DriverEntity })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(+id, updateDriverDto);
  }
}
