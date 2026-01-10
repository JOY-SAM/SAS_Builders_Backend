import { ApiProperty } from '@nestjs/swagger';

export class OilExpenseStatusEntity {
  @ApiProperty({ example: 'KA-01-AB-1234', description: 'Vehicle number' })
  vehicleNo: string;

  @ApiProperty({ example: 'Good', description: 'Oil status' })
  status: string;

  @ApiProperty({ example: 100, description: 'Hours left until next oil change' })
  hoursLeft: number;

  @ApiProperty({ example: 1200, description: 'Total hours when oil was last changed' })
  lastChangedOn: number;

  @ApiProperty({ example: 1400, description: 'Current total vehicle hours' })
  currentHours: number;

  @ApiProperty({ example: 300, description: 'Oil change interval in hours' })
  oilChangeInterval: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  vehicleId: number;
}
