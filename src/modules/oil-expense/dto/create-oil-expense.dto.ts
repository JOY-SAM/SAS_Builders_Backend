import { ApiProperty } from '@nestjs/swagger';

export class CreateOilExpenseDto {
  @ApiProperty({ example: 1, description: 'Vehicle ID associated with the expense' })
  vehicleId: number;

  @ApiProperty({ example: 1, description: 'Driver ID (User ID) associated with the expense', required: false })
  driverId?: number;

  @ApiProperty({ example: 3500.00, description: 'Amount of the oil change expense', required: false })
  amount?: number;

  @ApiProperty({ example: 50, description: 'Hours ran to add to total', required: false })
  hours?: number;

  @ApiProperty({ example: 'Oil change and filter replacement', description: 'Description of the expense', required: false })
  description?: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z', description: 'Time of the expense', required: false })
  expenseTime?: string;
}
