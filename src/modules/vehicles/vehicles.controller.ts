import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleEntity } from './entities/vehicle.entity';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle', description: 'Request Body: CreateVehicleDto, Response: VehicleEntity' })
  @ApiResponse({ status: 201, description: 'The vehicle has been successfully created. (VehicleEntity)', type: VehicleEntity })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles', description: 'Response: VehicleEntity[]' })
  @ApiResponse({ status: 200, description: 'Return all vehicles. (VehicleEntity[])', type: VehicleEntity, isArray: true })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID', description: 'Params: id (number), Response: VehicleEntity' })
  @ApiResponse({ status: 200, description: 'Return the vehicle. (VehicleEntity)', type: VehicleEntity })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle', description: 'Params: id (number), Request Body: UpdateVehicleDto, Response: VehicleEntity' })
  @ApiResponse({ status: 200, description: 'The vehicle has been successfully updated. (VehicleEntity)', type: VehicleEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }
}
