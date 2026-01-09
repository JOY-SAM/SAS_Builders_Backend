import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'KL-01-AB-1234', description: 'Vehicle registration number', required: false })
  number?: string;

  @ApiProperty({ example: 'Toyota Innova', description: 'Name of the vehicle', required: false })
  name?: string;

  @ApiProperty({ example: 'SUV', description: 'Category of the vehicle', required: false })
  category?: string;

  @ApiProperty({ example: '2023-10-01T00:00:00Z', description: 'Date when oil was last changed', required: false })
  oilLastChanged?: string;

  @ApiProperty({ example: 5000, description: 'Oil change interval in hours', required: false })
  oilChangeIntervalHours?: number;

  @ApiProperty({ example: 12000, description: 'Total hours ran', required: false })
  totalHoursRan?: number;

  @ApiProperty({ example: 'Company vehicle', description: 'Description of the vehicle', required: false })
  description?: string;
}
