import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from '@prisma/client';

export class VehicleEntity implements Vehicle {
  @ApiProperty({ example: 1, description: 'The unique identifier of the vehicle' })
  id: number;

  @ApiProperty({ example: 'KL-01-AB-1234', description: 'Vehicle registration number', required: false, nullable: true })
  number: string | null;

  @ApiProperty({ example: 'Toyota Innova', description: 'Name of the vehicle', required: false, nullable: true })
  name: string | null;

  @ApiProperty({ example: 'SUV', description: 'Category of the vehicle', required: false, nullable: true })
  category: string | null;

  @ApiProperty({ example: 1000, description: 'Engine hour when oil was last changed', required: false, nullable: true })
  oilLastChangedHour: number | null;

  @ApiProperty({ example: 5000, description: 'Oil change interval in hours', required: false, nullable: true })
  oilChangeIntervalHours: number | null;

  @ApiProperty({ example: 12000, description: 'Total hours ran', required: false, nullable: true })
  totalHoursRan: number | null;

  @ApiProperty({ example: 'Company vehicle', description: 'Description of the vehicle', required: false, nullable: true })
  description: string | null;

  @ApiProperty({ example: '2023-10-01T00:00:00Z', description: 'Record creation date' })
  createdAt: Date;
}
